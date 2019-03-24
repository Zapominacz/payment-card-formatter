import { onCardInputChange } from './cardFormatter';

const prepareResult = (text, position) => {
  let result = onCardInputChange({ text, selectionStart: position, selectionEnd: position });
  delete result.format;
  return { text: result.text, position: result.selectionStart }
}

it('Accept unformatted card', () => {
  expect(prepareResult('4532874060054340', 16))
  .toEqual({ text: '4532 8740 6005 4340', position: 19 });
});

it('Accept overflowed card', () => {
  expect(prepareResult('453287406005434045328740600543404532874060054340', 16))
  .toEqual({ text: '4532 8740 6005 4340', position: 19 });
});

it('Will not add space when group is completed', () => {
  const text = '45321234';
  const result = '4532 1234';
  expect(prepareResult(text, text.length))
  .toEqual({ text: result, position: result.length });
});

it('Pressing space when present will not add additional space', () => {
  const text = '4532  1234';
  expect(prepareResult(text, 5))
  .toEqual({ text: '4532 1234', position: 5 });
});

it('Add new number before space will add it after space', () => {
  const text = '45320 1234';
  expect(prepareResult(text, 5))
  .toEqual({ text: '4532 0123 4', position: 6 });
});

it('Remove non-trailing space will jump position to previous group', () => {
  expect(prepareResult('45321234', 4))
  .toEqual({ text: '4532 1234', position: 4 });
});

it('Add digit at the end of group will move digit to new group', () => {
  expect(prepareResult('5325 32531 1525 3252', 10))
  .toEqual({ text: '5325 3253 1152 5325', position: 11 });
});

it('Bad character will make position hold', () => {
  expect(prepareResult('5325 3a253 1525 3252', 7))
  .toEqual({ text: '5325 3253 1525 3252', position: 6 });
});

it('Remove from "aligned" value first digit in group will move carret at the group beginning', () => {
  expect(prepareResult('5235 235 5', 5))
  .toEqual({ text: '5235 2355', position: 5 });
});

it('Parses amex card', () => {
  expect(prepareResult('378282246310005', 15))
  .toEqual({ text: '3782 822463 10005', position: 17 });
});

it('Parses visa card', () => {
  expect(prepareResult('4929-2626-8953-0620', 19))
  .toEqual({ text: '4929 2626 8953 0620', position: 19 });
});

it('Parses mastercard card', () => {
  expect(prepareResult('5345572289581', 13))
  .toEqual({ text: '5345 5722 8958 1', position: 16 });
});


