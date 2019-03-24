const DIGITS = "0123456789";
const SPACES = " -";
const SPACE = " ";
const EMPTY = "";

export const formats = [
  {
    name: 'mastercard',
    regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
    blocks: [ 4, 4, 4, 4 ],
  },
  {
    name: 'maestro',
    regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
    blocks: [ 4, 4, 4, 4 ],
  },
  {
    name: 'visa',
    regex: /^4\d{0,15}/,
    blocks: [ 4, 4, 4, 4 ],
  },
  {
    name: 'uatp',
    regex: /^(?!1800)1\d{0,14}/,
    blocks: [ 4, 5, 6 ],
  },
  {
    name: 'amex',
    regex: /^3[47]\d{0,13}/,
    blocks: [ 4, 6, 5 ],
  },
  {
    name: 'discover',
    regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
    blocks: [ 4, 4, 4, 4 ],
  },
  {
    name: 'dinners',
    regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
    blocks: [ 4, 6, 4 ],
  },
  {
    name: 'dankort',
    regex: /^(5019|4175|4571)\d{0,12}/,
    blocks: [ 4, 4, 4, 4 ],
  },
  {
    name: 'instapayments',
    regex: /^63[7-9]\d{0,13}/,
    blocks: [ 4, 4, 4, 4 ],
  },
  {
    name: 'jcb15',
    regex: /^(?:2131|1800)\d{0,11}/,
    blocks: [ 4, 6, 5 ],
  },
  {
    name: 'jcb',
    regex: /^(?:35\d{0,2})\d{0,12}/,
    blocks: [ 4, 4, 4, 4 ],
  },
  {
    name: 'mir',
    regex: /^220[0-4]\d{0,12}/,
    blocks: [ 4, 4, 4, 4 ],
  },
  {
    name: 'unionpay',
    regex: /^62\d{0,14}/,
    blocks: [ 4, 4, 4, 4 ],
  },
  {
    name: 'other',
    regex: /\d{0,16}/,
    blocks: [ 4, 4, 4, 4 ],
  }
]

export const removeFormatting = (text) => text.replace(SPACE, EMPTY);

export const detectFormat = (text) => {
  const value = removeFormatting(text);
  return formats.find(f => f.regex.test(value));
}

const gapPosition = (result) => {
  const length = result.text.length;
  let position = 0;
  for(const blockSize of result.format.blocks) {
    position += blockSize;
    if (length === position) { return true; }
    position += SPACE.length;
  }
  return false;
}

const passValue = (result, char, i, testDebug) => {
  result.text += char;
  testDebug && console.log(i, 'add', char);
}

const insertGap = (result, i, testDebug) => {
  result.text += SPACE;
  testDebug && console.log(i, 'space added');
  if( result.text.length <= result.selectionStart ) {
    const spaceLength = SPACE.length;
    result.selectionStart += spaceLength;
    result.selectionEnd += spaceLength;
    testDebug && console.log('position +');
  }
}

const skipValue = (result, i, testDebug) => {
  testDebug && console.log(i, 'skipped');
  if(result.text.length < result.selectionStart) {
    testDebug && console.log('position -')
    result.selectionStart--;
    result.selectionEnd--;
  }
}

export const onCardInputChange = (input, testDebug = false) => {
  testDebug && console.log('input', input);
  const result = {
    text: '',
    selectionStart: input.selectionStart || 0,
    selectionEnd: input.selectionEnd || 0,
    format: detectFormat(input.text),
  };
  const inputLength = input.text.length;
  const maxLength = result.format.blocks.reduce((acc, v) => acc + v, 0) + result.format.blocks.length - 1;
  for (let i = 0; i < inputLength; i++) {
    const c = input.text.charAt(i);
    if (gapPosition(result)) {
      if(DIGITS.includes(c)) {
        insertGap(result, i, testDebug);
        passValue(result, c, i, testDebug);
      } else if (SPACES.includes(c)) {
        passValue(result, SPACE, i, testDebug);
      } else {
        skipValue(result, i, testDebug);
      }
    } else {
      if(DIGITS.includes(c)) {
        passValue(result, c, i, testDebug);
      } else {
        skipValue(result, i, testDebug);
      }
    }
    if(result.text.length >= maxLength) {
      testDebug && console.log('Left overflow')
      break;
    }
  }
  testDebug && console.log('result', result);
  return result;
}
