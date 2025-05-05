import "./style.css";
import { Application, Assets, AssetsManifest, Container, Sprite, Text, Texture } from "pixi.js";
import "@esotericsoftware/spine-pixi-v8";

import CONSTANTS from "./constants";
import DeckSolution from "./solutions/deck-solution";
import WordsSolution from "./solutions/words-solution";
import PhoenixSolution from "./solutions/phoenix-solution";

const aspectRatio: number = CONSTANTS.GetGameWidth() / CONSTANTS.GetGameHeight()

console.log(
    `%cSoftgames Game Developer Assignment%c`,
    "background: #ff66a1; color: #FFFFFF; padding: 2px 4px; border-radius: 2px; font-weight: bold;",
    "color: #D81B60; font-weight: bold;",
    //     "color: #ff66a1;",
);

(async () => {
    const app: Application = new Application();

    const menu: Container<any> = new Container()

    let currentScene: Container<any>;
    let btnX: Sprite;
    let fpsText: Text;

    //await window load
    await new Promise((resolve) => {
        window.addEventListener("load", resolve);
    });

    await app.init({ backgroundColor: 0xd3d3d3, width: CONSTANTS.GetGameWidth(), height: CONSTANTS.GetGameHeight(), antialias: true });

    await loadGameAssets();

    async function loadGameAssets(): Promise<void> {
        const manifest = {
            bundles: [
                { name: "card", assets: [{ alias: "card", src: "./assets/card.png" }] },
                { name: "btn_ace", assets: [{ alias: "btn_ace", src: "./assets/button_ace.png" }] },
                { name: "btn_words", assets: [{ alias: "btn_words", src: "./assets/button_words.png" }] },
                { name: "btn_phoenix", assets: [{ alias: "btn_phoenix", src: "./assets/button_phoenix.png" }] },
                { name: "btn_x", assets: [{ alias: "btn_x", src: "./assets/button_x.png" }] },
                { name: "fire_particle", assets: [{ alias: "fire_particle", src: "./assets/fire_particle.png" }] },
            ],
        } satisfies AssetsManifest;

        await Assets.init({ manifest });
        await Assets.loadBundle(["fire_particle", "card", "btn_ace", "btn_words", "btn_phoenix", "btn_x", "pixieData", "pixieAtlas"]);

        document.body.appendChild(app.canvas);

        resizeCanvas();

        const aceBtn: Sprite = createMenuButton(Texture.from("btn_ace"), CONSTANTS.GetGameHeight() / 4)
        const wordsBtn: Sprite = createMenuButton(Texture.from("btn_words"), CONSTANTS.GetGameHeight() / 2)
        const phoenixBtn: Sprite = createMenuButton(Texture.from("btn_phoenix"), CONSTANTS.GetGameHeight() * ( 3 / 4))

        menu.addChild(aceBtn)
        menu.addChild(wordsBtn)
        menu.addChild(phoenixBtn)

        app.stage.addChild(menu)

        aceBtn.on("pointerdown", runDeckSolution)
        wordsBtn.on("pointerdown", runWordsSolution)
        phoenixBtn.on("pointerdown", runPhoenixSolution)

        btnX = createXButton(Texture.from("btn_x"))
        btnX.visible = false

        fpsText = createFPSText()
        app.stage.addChild(fpsText)

        app.ticker.add((time: any) => {
            fpsText.text = `FPS: ${Math.round(1000/time.deltaMS)}`
        })

        addFullscreenListener()
    }

    function addFullscreenListener(): void{
        window.addEventListener("click", () => {
            document.documentElement.requestFullscreen()
        })
    }

    function runWordsSolution(): void{
        menu.visible = false
        btnX.visible = true
        currentScene = WordsSolution(app)
    }

    function runDeckSolution(): void{
        menu.visible = false
        btnX.visible = true
        currentScene = DeckSolution(app);
    }

    function runPhoenixSolution(): void{
        menu.visible = false
        btnX.visible = true
        currentScene = PhoenixSolution(app)
    }

    function createFPSText(): Text{
        return new Text({
            text: "FPS: 60",
        } as any)
    }

    function createXButton(texture: any): Sprite{
        const btn = new Sprite(texture)
        btn.anchor.x = 0.5
        btn.anchor.y = 0.5
        btn.position.x = CONSTANTS.GetGameWidth() * (28/30)
        btn.position.y = CONSTANTS.GetGameHeight() / 30
        btn.scale.set(4.0,4.0)
        app.stage.addChild(btn)

        btn.eventMode = "static"
        btn.cursor = "pointer"

        btn.on("pointerdown", backToMenu)

        return btn
    }

    function backToMenu(): void{
        if (currentScene) {
            app.stage.removeChild(currentScene)
            menu.visible = true
            btnX.visible = false
        }
    }

    function createMenuButton(texture: any, positionY: number): Sprite{
        const btn: Sprite = new Sprite(texture)
        btn.scale.set(5.0,5.0)

        btn.anchor.x = 0.5
        btn.anchor.y = 0.5
        btn.position.x = CONSTANTS.GetGameWidth() / 2
        btn.position.y = positionY

        btn.eventMode = "static"
        btn.cursor = "pointer"

        return btn

    }

    function resizeCanvas(): void {
        const resize = () => {

            let height: number = window.innerHeight
            let width: number = height * aspectRatio
            if(window.innerWidth < width){
                width = window.innerWidth
                height = width / aspectRatio
                app.renderer.resize(width, height);
            } else {
                app.renderer.resize(height * aspectRatio, height);
            }
            app.stage.scale.x = width / CONSTANTS.GetGameWidth();
            app.stage.scale.y = height / CONSTANTS.GetGameHeight();
        };

        resize();

        window.addEventListener("resize", resize);
    }
})();
