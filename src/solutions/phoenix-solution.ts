import { Container, Sprite, Texture } from "pixi.js";
import CONSTANTS from "../constants";
import Particle from "../classes/particle";

const MAX_PARTICLES = 10
const EMIT_RADIUS = 0.5
const PARTICLE_SCALE_MIN = 3.5
const PARTICLE_SCALE_MAX = 4.5
const PARTICLE_COLOR_RAMP = 300
const TIME_ALIVE_MIN = 300
const TIME_ALIVE_MAX = 500
const PARTICLE_VELOCITY_Y_MIN = -1.2
const PARTICLE_VELOCITY_Y_MAX = -1.5
const PARTICLE_VELOCITY_X_MIN = -0.25
const PARTICLE_VELOCITY_X_MAX = 0.25
const FIRE_ORIGIN_COLOR = "#dd0"
const PARTICLE_START_TINT = "#ff0"
const EMIT_TIME = 0.05
const FIRE_ORIGIN_SCALE = 4.0

const PhoenixSolution = (app: any) => {
    const scene = new Container()

    let time_until_emit = 0

    const fireParticleTexture = Texture.from("fire_particle")
    const emitOriginX = CONSTANTS.GetGameWidth() / 2
    const emitOriginY = CONSTANTS.GetGameHeight() * (3/ 4)

    let particles: Particle[] = []

    app.stage.addChild(scene)

    app.ticker.add((time: any) =>
    {
        time_until_emit -= time.deltaMS;
        if (time_until_emit <= 0 && particles.length <= MAX_PARTICLES){
            const particle = createParticle(fireParticleTexture, emitOriginX, emitOriginY)
            scene.addChild(particle.sprite)
            particles.push(particle)
            time_until_emit = EMIT_TIME
        }
        particles = updateParticles(scene, particles, time.deltaMS)
    });

    createFireOrigin(fireParticleTexture, scene, emitOriginX, emitOriginY)

    return scene
}

const createFireOrigin = (texture: any, scene: any, positionX: any, positionY: any) => {
    const particleSprite = new Sprite(texture);
    particleSprite.tint = FIRE_ORIGIN_COLOR
    particleSprite.x = positionX
    particleSprite.y = positionY

    particleSprite.anchor.x = 0.5
    particleSprite.anchor.y = 0.5
    particleSprite.scale.set(FIRE_ORIGIN_SCALE)

    scene.addChild(particleSprite)
}

const createParticle = (texture: any, positionX: any, positionY: any) => {
    const particleSprite = new Sprite(texture);

    particleSprite.tint = PARTICLE_START_TINT

    particleSprite.x = positionX + (- EMIT_RADIUS + EMIT_RADIUS * Math.random() * 2)
    particleSprite.y = positionY + (- EMIT_RADIUS + EMIT_RADIUS * Math.random() * 2)

    particleSprite.anchor.x = 0.5
    particleSprite.anchor.y = 0.5

    const timeAlive =  TIME_ALIVE_MIN + Math.random() * (TIME_ALIVE_MAX - TIME_ALIVE_MIN)
    const velocityY = PARTICLE_VELOCITY_Y_MIN - Math.random() * (PARTICLE_VELOCITY_Y_MAX - PARTICLE_VELOCITY_Y_MIN)
    const velocityX = PARTICLE_VELOCITY_X_MIN + Math.random() * (PARTICLE_VELOCITY_X_MAX - PARTICLE_VELOCITY_X_MIN)

    const scale = PARTICLE_SCALE_MIN + Math.random() * (PARTICLE_SCALE_MAX - PARTICLE_SCALE_MIN)

    const particle = new Particle(particleSprite, timeAlive, velocityX, velocityY, scale, PARTICLE_COLOR_RAMP)

    return particle
}

const updateParticles = (scene: any, particles: any, deltaMS: any) => {
    const particlesToDelete: any[] = []

    particles.forEach((particle: any) => {
        particle.update(deltaMS)
        if (particle.timeAlive <= 0){
            particlesToDelete.push(particle)
        }
    })

    particlesToDelete.forEach((particleToDelete: any) => scene.removeChild(particleToDelete))

    return particles.filter((particle: any) => !particlesToDelete.includes(particle))
}

export default PhoenixSolution