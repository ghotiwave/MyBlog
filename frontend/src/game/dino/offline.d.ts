declare module '@/game/dino/offline.js' {
  export class Runner {
    constructor(container: HTMLElement)
    distanceRan: number
    crashed: boolean
    playing: boolean
    config: Record<string, number>
    destroy(): void
  }
}
