/* eslint-disable max-classes-per-file */
import { VldResult, VldType } from '../validator/validator'

class VNumber implements VldType {
    private min: number

    private max: number

    constructor (min: number = 0, max: number = 120) {
        this.min = min
        this.max = max
    }

    public check (value: string, fname: string): VldResult {
        const num = parseInt(value, 10)
        if (num < this.min || num > this.max) {
            const msg = `${fname} must be from ${this.min} to ${this.max}`
            return { error: msg }
        }

        return {}
    }
}

class VLen implements VldType {
    private min: number

    private max: number

    constructor (min: number = 0, max: number = 120) {
        this.min = min
        this.max = max
    }

    public check (value: string, fname: string): VldResult {
        return value.length < this.min || value.length > this.max
            ? { error: `${fname} length must be in ${this.min} - ${this.max}` }
            : {}
    }
}

class VUrl implements VldType {
    private _protocols: string[]

    constructor (protocols: string[] = [ 'https:' ]) {
        this._protocols = protocols
    }

    public check (value: string, fname: string): VldResult {
        let url: URL

        try {
            url = new URL(value)
        } catch (_) {
            return { error: `${fname} got invalid URL` }
        }

        if (!this._protocols.includes(url.protocol)) {
            return { error: `${fname} URL protocol must be https` }
        }

        return {}
    }
}

class VHex implements VldType {
    private _regex: RegExp = /^[0-9a-fA-F]+$/

    private _pfx: string

    constructor (pfx: string = '0x') {
        this._pfx = pfx
    }

    public check (value: string, fname: string): VldResult {
        if (value.length < this._pfx.length) {
            return { error: `${fname} too small` }
        }

        if (!value.startsWith(this._pfx)) {
            return { error: `${fname} must starts with ${this._pfx}` }
        }

        if (!(value.slice(this._pfx.length)).match(this._regex)) {
            return { error: `${fname} are invalid hexadecimal value` }
        }

        return {}
    }
}

class VEmail implements VldType {
    // eslint-disable-next-line no-useless-escape
    private _regex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    public check (value: string, fname: string): VldResult {
        if (!value.match(this._regex)) {
            return { error: `${fname} are invalid email address` }
        }

        return {}
    }
}

class VDomain implements VldType {
    // eslint-disable-next-line max-len, no-useless-escape
    private _regex: RegExp = /(?![\d.]+)((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\._-]{1,61}|[a-z0-9-]{1,30})/gm

    public check (value: string, fname: string): VldResult {
        if (!value.match(this._regex)) {
            return { error: `${fname} are invalid domain address` }
        }

        return {}
    }
}

export { VNumber, VLen, VUrl, VHex, VEmail, VDomain }
