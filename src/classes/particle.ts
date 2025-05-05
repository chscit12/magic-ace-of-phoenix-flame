import { Sprite } from "pixi.js";

const MAX_RGB = 16777215

export default class Particle {
    sprite: Sprite
    velocityX: number
    velocityY: number
    timeAlive: number
    startTimeAlive: number
    scale: number
    colorRamp: number

    constructor(sprite: any, timeAlive: any, velocityX: any, velocityY: any, scale: any, colorRamp: any) {
        this.sprite = sprite
        this.timeAlive = timeAlive
        this.startTimeAlive = timeAlive
        this.velocityX = velocityX
        this.velocityY = velocityY
        this.scale = scale
        this.colorRamp = colorRamp

        this.sprite.scale.set(this.scale)
    }

    update(deltaMS: number){
        this.timeAlive -= deltaMS
        this.sprite.x += this.velocityX * deltaMS
        this.sprite.y += this.velocityY * deltaMS
        this.sprite.alpha = this.timeAlive / this.startTimeAlive
        this.sprite.scale.set((this.timeAlive / this.startTimeAlive) * this.scale)

        const newTint = this.sprite.tint - this.colorRamp * deltaMS
        this.sprite.tint = Math.min(newTint, MAX_RGB)
        // Exclude Blue from the tint
        this.sprite.tint = this.sprite.tint & 0xffff00
    }
}