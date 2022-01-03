const fireConfig = {
    lifetime: {
        min: 0.4,
        max: 0.4
    },
    frequency: 0.001,
    spawnChance: 1,
    emitterLifetime: 0.1,
    maxParticles: 100,
    pos: {
        x: 0,
        y: 0
    },
    addAtBack: true,
    behaviors: [
        {
            type: 'alpha',
            config: {
                alpha: {
                    list: [
                        {
                            value: 0.8,
                            time: 0
                        },
                        {
                            value: 0,
                            time: 1
                        }
                    ],
                },
            }
        },
        {
            type: 'scale',
            config: {
                scale: {
                    list: [
                        {
                            value: 0.1,
                            time: 0
                        },
                        {
                            value: 0.05,
                            time: 1
                        }
                    ],
                },
            }
        },
        {
            type: 'moveSpeed',
            config: {
                speed: {
                    list: [
                        {
                            value: 400,
                            time: 0
                        },
                        {
                            value: 0,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
            }
        },
        {
            type: 'rotationStatic',
            config: {
                min: 0,
                max: 360
            }
        },
        {
            type: "spawnShape",
            config: {
                type: "torus",
                data: {
                    x: 0,
                    y: 0,
                    radius: 10,
                    innerRadius: 0,
                    affectRotation: false
                }
            }
        },
        {
            type: 'textureSingle',
            config: {
                texture: 'fire.png'
            }
        }
    ],
};

export { fireConfig };