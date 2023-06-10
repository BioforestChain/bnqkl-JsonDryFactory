const WalkerStep = [
  /// 一共8步，下标从0开始，
  128, // 1
  64, // 2
  32, // 3
  16, // 4
  8, // 5
  4, // 6
  2, // 7
  1, // 8
];
export class BoolRecoder {
  constructor(
    /* Uint8Array */
    readonly walk: number[] = [],
  ) {}
  private walk_step = -1;

  record(value: boolean) {
    const { walk } = this;
    const walk_step = (this.walk_step = (this.walk_step + 1) % 8);
    if (walk_step === 0) {
      walk.push(0);
    }
    if (value) {
      walk[walk.length - 1] |= WalkerStep[walk_step];
    }
  }
  *play() {
    const { walk } = this;
    for (const cur_walk of walk) {
      for (let walk_step = 0; walk_step < 8; ++walk_step) {
        yield (cur_walk & WalkerStep[walk_step]) !== 0;
      }
    }
  }
}
