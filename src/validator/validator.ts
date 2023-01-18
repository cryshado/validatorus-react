import React from 'react'

export interface VldType { check (value: string, fname: string): VldResult }
export interface VldResult {error?: string}

type IsError = 'default' | 'error' | 'valid'

class VldBuilder {
    private _validators: VldType[] = [ ]

    private _fname: string = 'Field'

    private _value: string

    private _setValue: React.Dispatch<React.SetStateAction<string>>

    private _iserr: IsError

    private _setIserr: React.Dispatch<React.SetStateAction<IsError>>

    private _error: string

    private _setError: React.Dispatch<React.SetStateAction<string>>

    constructor () {
        const [ value, setValue ] = React.useState<string>('')
        const [ iserr, setIserr ] = React.useState<IsError>('default')
        const [ error, setError ] = React.useState<string>('')

        this._value = value
        this._setValue = setValue

        this._iserr = iserr
        this._setIserr = setIserr

        this._error = error
        this._setError = setError
    }

    public with <
        T extends VldType,
        A extends
        readonly unknown[]
    >
    (Validator: new(...args: A) => T, ...args: A): VldBuilder {
        this._validators.push(new Validator(...args))
        return this
    }

    public withFname (name: string): VldBuilder {
        this._fname = name
        return this
    }

    public change (value: string): void {
        this._setValue(value)

        for (let i = 0; i < this._validators.length; i++) {
            const result = this._validators[i].check(value, this._fname)
            if (result.error) {
                this._setIserr('error')
                this._setError(result.error)
                return
            }
        }

        this._setIserr('valid')
        this._setError('')
    }

    public reset (errors: boolean = true, value: boolean = false) : void {
        if (errors) {
            this._setIserr('default')
            this._setError('')
        }

        if (value) {
            this._setValue('')
        }
    }

    public get fname (): string { return this._fname }

    public get value (): string { return this._value }

    public get iserr (): boolean { return this._iserr }

    public get error (): string { return this._error }
}

export { VldBuilder }
