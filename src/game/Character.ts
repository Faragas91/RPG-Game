export interface CharacterConfig {
    maxHp: number;
    attack: number;
    defense: number;
    level: number;
    xp: number;
    kind: "monster" | "human" | "cyborg"
}

type CharacterStat = "maxHp" | "attack" | "defense"

export class Character {
    private _maxHp: number;
    private _hp: number;
    private _attack: number;
    private _defense: number; 
    private _level: number;
    private _xp: number;
    private _kind: "monster" | "human" | "cyborg"

    constructor(config: CharacterConfig) {
        this._maxHp = config.maxHp;
        this._hp = config.maxHp;
        this._attack = config.attack;
        this._defense = config.defense;
        this._level = config.level;
        this._xp = config.xp;
        this._kind = config.kind
    }

    get hp() {
        return this._hp;
    }

    get attack() {
        return this._attack;
    }

    get defense(){
        return this._defense;
    }

    get maxHp() {
        return this._maxHp;
    }

    get level() {
        return this._level;
    }

    get xp() {
        return this._xp;
    }

    get kind() {
        return this._kind
    }

    get isAlive() {
        return this._hp > 0;
    }

    takeDamage(amount: number): void {
        this._hp = Math.max(0, this.hp - Math.max(0, amount))
    }

    heal(amount: number): void {
        this._hp = Math.max(0, Math.min(this._maxHp, this.hp + Math.max(0, amount)))
    }

    gainXp(amount: number): boolean {
        if (this._hp > 0) {
            this._xp += amount;
            this.levelUp();
            return true;
        }
        return false;
    }

    levelUp() {
        if (this._xp >= this._level * 100) {
            this._xp -= this._level*100;
            this._level++
        }
    }

    increaseStat(stat: CharacterStat) {
        if (stat === "maxHp") {
            this._maxHp += 10;
        } else if (stat === "attack") {
            this._attack += 1;
        } else if (stat = "defense") {
            this._defense += 1
        }
    }
}