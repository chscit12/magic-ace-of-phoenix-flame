import { Assets, Container, Sprite, Texture, Text } from "pixi.js";
import CONSTANTS from "../constants";

const API_URL = "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords"

let text: any
let sprite: any

const TEXT_X: number = 50
const TEXT_Y: number = 400
const SPRITE_Y: number = 100
const SPRITE_X_LEFT: number = 100
const SPRITE_X_RIGHT_OFFSET: number = 300
const WORD_WRAP_EDGES: number = 100

const WordsSolution = (app: any) => {
    const scene = new Container()
    let dialogueData: any;
    let initialized: boolean = false
    let currentText: number = 0
    let avatars: any[] = []
    let emojies: any[] = []
    let textContainer: any = new Container()
    let loadingText: any = new Text("Loading...")
    textContainer.addChild(loadingText)

    textContainer.x = 100
    textContainer.y = TEXT_Y

    sprite = null
    text = null

    scene.addChild(textContainer)

    app.stage.addChild(scene)

    fetch(API_URL).then(async (response: Response) => {
        const data = await response.json()
        dialogueData = data
        const avatarsData = await loadAllAvatars(data.avatars)
        const emojiData = await loadAllEmoji(data.emojies)
        avatars = avatarsData
        emojies = emojiData
        initialized = true

        createDialoguePart(scene, avatars, dialogueData, 0)
        renderResponsiveRichText({
            container: textContainer, text: dialogueData.dialogue[0].text,
            style: {fontSize: 60}, iconMap: emojies, maxWidth: 600
        })
    })

    scene.eventMode = "static"
    scene.cursor = "pointer"

    scene.on("pointerdown", () => {
        if(dialogueData.dialogue.length -1 <= currentText) return;

        currentText++

        if(avatarIsIncludedInData(avatars, dialogueData, currentText)){
            createDialoguePart(scene, avatars, dialogueData, currentText)
            renderResponsiveRichText({
                container: textContainer, text: dialogueData.dialogue[currentText].text,
                style: {fontSize: 60}, iconMap: emojies, maxWidth: 600
            })
        }
    })

    app.ticker.add((time: any) => {
        if (!initialized) return;
        //time.deltaMS
    })

    return scene
}

// This one is created with the help of ChatGpt.
function renderResponsiveRichText({
                                      container,
                                      text,
                                      style,
                                      iconMap,
                                      maxWidth,
                                      iconScale = 0.5,
                                      lineSpacing = 4
                                  }: any) {
    container.removeChildren();

    const words = text.split(/(\s+)/); // Split on spaces aswell
    const lines = [];
    let currentLine = [];
    let currentLineWidth = 0;

    for (const word of words) {
        let displayObject;
        let wordWidth = 0;

        const iconMatch = word.match(/^\{(.+?)\}$/);
        if (iconMatch) {
            const iconName = iconMatch[1];
            const texture = iconMap.find((icon: any) => icon.name === iconName)?.texture

            if (texture) {
                const sprite = new Sprite(texture);
                sprite.scale.set(iconScale);
                wordWidth = sprite.width;
                displayObject = sprite;
            }
        } else {
            const textObj = new Text(word, style);
            wordWidth = textObj.width;
            displayObject = textObj;
        }

        // In case it's too large for the line
        if (currentLineWidth + wordWidth > maxWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = [];
            currentLineWidth = 0;
        }

        if (displayObject) {
            currentLine.push({ obj: displayObject, width: wordWidth });
            currentLineWidth += wordWidth;
        }
    }

    // Add last line
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    // Layout for objects
    let y = 0;
    for (const line of lines) {
        let x = 0;
        let maxHeight = 0;

        for (const { obj, width } of line) {
            obj.x = x;
            obj.y = 0;
            x += width;
            if (obj.height > maxHeight) maxHeight = obj.height;
        }

        const lineContainer = new Container();
        for (const { obj } of line) {
            lineContainer.addChild(obj);
        }

        lineContainer.y = y;
        container.addChild(lineContainer);
        y += maxHeight + lineSpacing;
    }
}


const avatarIsIncludedInData = (avatars: any, dialogueData: any, currentText: any) => {
    return avatars.find((avatar: any) => avatar.name === dialogueData.dialogue[currentText].name)
}

const getAvatarPosition = (avatars:any, avatarName: string) => {
    return avatars.find(((avatar: any) => avatar.name === avatarName)).position
}

const createDialoguePart = (scene: any, avatars:any , dialogueData: any, dialoguePart: any) => {
    if (!sprite){
        sprite = new Sprite(getImageTextureForPerson(avatars, dialogueData.dialogue[dialoguePart].name))
        scene.addChild(sprite)
        sprite.x = SPRITE_X_LEFT
        sprite.y = SPRITE_Y
    } else {
        sprite.texture = getImageTextureForPerson(avatars, dialogueData.dialogue[dialoguePart].name)
    }
    if(getAvatarPosition(avatars, dialogueData.dialogue[dialoguePart].name) === "right"){
        sprite.x = CONSTANTS.GetGameWidth() - SPRITE_X_RIGHT_OFFSET
    } else {
        sprite.x = SPRITE_X_LEFT
    }

    sprite.scale.set(2.0)
}

const loadTexture = async(src: any) => {
    return await Assets.load({
        src,
        loadParser: 'loadTextures'
    })
}

const loadAllEmoji = async(emojies:any): Promise<any[]> => {
    return await Promise.all(emojies.map(async (emojie:any) => {
        const texture = await loadTexture(emojie.url)
        return {name: emojie.name, texture}
    }))
}

const loadAllAvatars = async(avatars:any): Promise<any[]> => {
    return await Promise.all(avatars.map(async (avatar:any) => {
        const texture = await loadTexture(avatar.url)
        return {name: avatar.name, texture, position: avatar.position}
    }))
}

const getImageTextureForPerson = (avatars: any, avatarName: string) => {
    return avatars.find((avatar:any) => avatar.name === avatarName).texture
}

export default WordsSolution