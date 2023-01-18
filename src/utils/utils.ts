import { VldBuilder } from '../validator/validator'

function joinBool (validators: VldBuilder[]): boolean {
    return validators.every(v => !v.iserr)
}

export { joinBool }
