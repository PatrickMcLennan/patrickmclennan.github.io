type FlexProperty =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-around'
  | 'space-evenly'
  | 'space-between'
  | 'stretch';

type FlexDirection = `row` | `column`;

export const mixins = {
  flex: ({
    jc = `center`,
    ai = `center`,
    fd = `row`,
  }: {
    jc?: FlexProperty;
    ai?: FlexProperty;
    fd?: FlexDirection;
  }) => ({
    display: `flex`,
    justifyContent: jc,
    alignItems: ai,
    flexDirection: fd,
  }),
};
