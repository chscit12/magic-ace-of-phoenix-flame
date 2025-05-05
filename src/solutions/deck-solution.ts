import { Application, Container, Sprite, Texture } from "pixi.js";
import CONSTANTS from "../constants";

const CARD_SWITCH_TIME: number = 1000
const CARD_TWEEN_TIME: number = 2000
const CARD_Y_OFFSET: number = 0.2
const CARD_X_OFFSET: number = -0.1
const CARD_SCALE: number = 5.0
const AMOUNT_CARDS: number = 144

const DeckSolution = (app: Application): Container<any> => {
    const scene: Container<any> = new Container()

    const deck: Container<any> = createDeck(
        Texture.from("card"),
        AMOUNT_CARDS
    )

    let currentSwitchTimer: number = CARD_SWITCH_TIME
    let flyingCards: any[] = []
    let cardsFinishedFlying: any[] = []

    deck.x = CONSTANTS.GetGameWidth()/2
    deck.y = CONSTANTS.GetGameHeight()/4

    const deck2 = new Container()
    deck2.x = CONSTANTS.GetGameWidth()/2
    deck2.y = CONSTANTS.GetGameHeight() * (3 / 4)

    let decksDistance: number = deck2.y - deck.y;

    scene.addChild(deck)
    scene.addChild(deck2)

    app.stage.addChild(scene)

    app.ticker.add((time: any) =>
    {
        currentSwitchTimer -= time.deltaMS

        if(currentSwitchTimer <= 0 && deck.children.length > 0){
            currentSwitchTimer = CARD_SWITCH_TIME
            const card: Sprite = deck.getChildAt(deck.children.length -1)
            flyingCards.push(card)
            deck2.reparentChild(card)
        }
        flyingCards.forEach(card => {
            card.y += (decksDistance) * (time.deltaMS / CARD_TWEEN_TIME)
            if (card.y >= deck2.children.length * CARD_Y_OFFSET){
                card.y = deck2.children.length * CARD_Y_OFFSET
                cardsFinishedFlying.push(card)
            }
        })
        flyingCards = flyingCards.filter(card => !cardsFinishedFlying.includes(card))
        cardsFinishedFlying = []
    });

    return scene
}


function createCard(texture: Texture): Sprite {
    const card: Sprite = new Sprite(texture);

    card.anchor.set(0.5,0.5)
    card.scale.set(CARD_SCALE)

    return card;
}

function createDeck(texture: Texture, amount: number): Container<any> {
    const deckContainer:Container<any> = new Container();

    for(let i: number = 0; i< amount; i++){
        const card = createCard(texture);
        card.position.set(i*CARD_X_OFFSET, i * CARD_Y_OFFSET)
        deckContainer.addChild(card)
    }

    return deckContainer;
}

export default DeckSolution