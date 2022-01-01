import { ObjectId } from 'mongodb';

export interface Player {
    name: string,
    played?: string
}

export interface IGame {
    type: string, 
    gameId: string, 
    playerA: Player, 
    playerB: Player, 
    t?: number
}

export class CPlayer {
    constructor(
        public name: string,
        public played?: string
    ) {}
}

export default class Game{
    constructor(
        public type: string, 
        public gameId: string, 
        public playerA: CPlayer, 
        public playerB: CPlayer, 
        public t?: number,
        public id?: ObjectId
        ) {}
}