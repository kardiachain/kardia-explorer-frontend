import JSBI from "jsbi";
import _Decimal from 'decimal.js-light'
import toFormat from 'toformat'
import _Big from 'big.js'

declare type BigintIsh = JSBI | bigint | string;
enum Rounding {
    ROUND_DOWN,
    ROUND_HALF_UP,
    ROUND_UP
}
const ONE = JSBI.BigInt(1)

const Decimal = toFormat(_Decimal)
const Big = toFormat(_Big)

const toSignificantRounding = {
    [Rounding.ROUND_DOWN]: 0,
    [Rounding.ROUND_HALF_UP]: 1,
    [Rounding.ROUND_UP]: 2
}

const toFixedRounding = {
    [Rounding.ROUND_DOWN]: 0,
    [Rounding.ROUND_HALF_UP]: 1,
    [Rounding.ROUND_UP]: 2
}

const toFraction = (numerator: BigintIsh, denominator: BigintIsh = ONE): Fraction => {
    return {
        numerator: parseBigintIsh(numerator),
        denominator: parseBigintIsh(denominator)
    } as Fraction
}

const parseBigintIsh = (bigintIsh: BigintIsh): JSBI => {
    return bigintIsh instanceof JSBI
      ? bigintIsh
      : typeof bigintIsh === 'bigint'
      ? JSBI.BigInt(bigintIsh.toString())
      : JSBI.BigInt(bigintIsh)
  }

const fractionAdd = (parseA: Fraction, parseB: Fraction): Fraction => {
    if (JSBI.equal(parseA.denominator, parseB.denominator)) {
        return {
            numerator: JSBI.add(parseA.numerator, parseB.numerator),
            denominator: parseA.denominator
        } as Fraction
    }
    return {
        numerator: JSBI.add(
            JSBI.multiply(parseA.numerator, parseB.denominator),
            JSBI.multiply(parseB.numerator, parseA.denominator)
        ),
        denominator: JSBI.multiply(parseA.denominator, parseB.denominator)
    } as Fraction
}

const fractionSubtract = (parseA: Fraction, parseB: Fraction): Fraction => {
    if (JSBI.equal(parseA.denominator, parseB.denominator)) {
        return {
            numerator: JSBI.subtract(parseA.numerator, parseB.numerator),
            denominator: parseA.denominator
        } as Fraction
    }
    return {
        numerator: JSBI.subtract(
            JSBI.multiply(parseA.numerator, parseB.denominator),
            JSBI.multiply(parseB.numerator, parseA.denominator)
        ),
        denominator: JSBI.multiply(parseA.denominator, parseB.denominator)
    } as Fraction
}

const fractionLessThan = (parseA: Fraction, parseB: Fraction): boolean => {
    return JSBI.lessThan(
        JSBI.multiply(parseA.numerator, parseB.denominator),
        JSBI.multiply(parseB.numerator, parseA.denominator)
    )
}

const fractionEqual = (parseA: Fraction, parseB: Fraction): boolean => {
    return JSBI.equal(
        JSBI.multiply(parseA.numerator, parseB.denominator),
        JSBI.multiply(parseB.numerator, parseA.denominator)
    )
}

const fractionGreaterThan = (parseA: Fraction, parseB: Fraction): boolean => {
    return JSBI.greaterThan(
        JSBI.multiply(parseA.numerator, parseB.denominator),
        JSBI.multiply(parseB.numerator, parseA.denominator)
    )
}

const fractionMultiply = (parseA: Fraction, parseB: Fraction): Fraction => {
    return {
        numerator: JSBI.multiply(parseA.numerator, parseB.numerator),
        denominator: JSBI.multiply(parseA.denominator, parseB.denominator)
    } as Fraction
}

const fractionDivide = (parseA: Fraction, parseB: Fraction): Fraction => {
    return {
        numerator: JSBI.multiply(parseA.numerator, parseB.denominator),
        denominator: JSBI.multiply(parseA.denominator, parseB.numerator)
    } as Fraction
}

const toSignificant = (
    parse: Fraction,
    significantDigits: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
): string => {
    Decimal.set({ precision: significantDigits + 1, rounding: toSignificantRounding[rounding] })
    const quotient = new Decimal(parse.numerator.toString())
        .div(parse.denominator.toString())
        .toSignificantDigits(significantDigits)
    return quotient.toFormat(quotient.decimalPlaces(), format)
}

const toFixed = (
    parse: Fraction,
    decimalPlaces: number = 0,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
): string => {
    Big.DP = decimalPlaces
    Big.RM = toFixedRounding[rounding]
    return new Big(parse.numerator.toString()).div(parse.denominator.toString()).toFormat(decimalPlaces, format)
}


export {
    fractionAdd,
    fractionSubtract,
    fractionLessThan,
    fractionEqual,
    fractionGreaterThan,
    fractionMultiply,
    fractionDivide,
    toSignificant,
    toFixed,
    parseBigintIsh,
    toFraction
}
