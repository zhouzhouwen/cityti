/* CITYTI 城格测试 核心数据（与语言无关）
 * 人格在不同地方有差异，人和城市"性格合拍"时自尊更高（Rentfrow et al., 2008, 2013；Bleidorn et al., 2016；Jokela et al., 2015）。
 * 4 个类型维度：外向性 E（热闹）、开放性 O（新潮）、尽责性 C（节奏）、宜人性 A（人情）；4 维 × 高低 = 16 座城市。
 * 第 5 维神经质 N（天气）只决定"雨天款 / 晴天款"，不决定是哪座城（气温与人格：Wei et al., 2017）。
 * 题目改写自公有领域 IPIP 大五题库；每个类型维度 6 题（正反向各 3），N 维 4 题（正反向各 2）。
 */
window.TI_CORE = {
  site: { id: 'cityti', name: 'CITYTI', version: '1.0.0', hero: ['beijing', 'chengdu', 'shanghai'], runner: 'train', loader: 'guangzhou', combo: ['chongqing', 'chengdu'], combo2: ['beijing', 'shanghai'] },
  typeDims: ['E', 'O', 'C', 'A'],
  modDim: 'N',
  eggTriggers: { speed: 'speed', sloth: 'sloth', night: 'night', early: 'early', again: 'again', twin: 'twin', shiny: 'shiny', weekend: 'weekend', lang: 'bilingual' },
  petEgg: 'petter',
  consoleArt: '(｡･ω･｡) 噗叽～ Squish!',
  dims: [
    { key: 'E', color: '#ff8a3d' },
    { key: 'O', color: '#1fb5a3' },
    { key: 'C', color: '#8b7cff' },
    { key: 'A', color: '#ff6fa5' },
    { key: 'N', color: '#4aa3df', human: true }
  ],
  // 题目顺序与 lang-*.js 里的 items 一一对应；k = 1 正向，-1 反向
  items: [
    { d: 'E', k: 1 }, { d: 'O', k: 1 }, { d: 'C', k: 1 }, { d: 'A', k: 1 },
    { d: 'E', k: -1 }, { d: 'O', k: -1 }, { d: 'N', k: 1 }, { d: 'C', k: -1 },
    { d: 'A', k: -1 }, { d: 'E', k: 1 }, { d: 'O', k: 1 }, { d: 'C', k: 1 },
    { d: 'A', k: 1 }, { d: 'N', k: -1 }, { d: 'E', k: -1 }, { d: 'O', k: -1 },
    { d: 'C', k: -1 }, { d: 'A', k: -1 }, { d: 'E', k: 1 }, { d: 'O', k: 1 },
    { d: 'N', k: 1 }, { d: 'C', k: 1 }, { d: 'A', k: 1 }, { d: 'E', k: -1 },
    { d: 'O', k: -1 }, { d: 'C', k: -1 }, { d: 'A', k: -1 }, { d: 'N', k: -1 }
  ],
  // 类型键 = E O C A 四维的高(H)/低(L)
  types: {
    HHHH: { art: 'shenzhen', bg: '#dcefff', ac: '#2f86d6' },
    HHHL: { art: 'shanghai', bg: '#ece3fb', ac: '#7d55c9' },
    HHLH: { art: 'changsha', bg: '#ffe2c6', ac: '#e0701f' },
    HHLL: { art: 'chongqing', bg: '#ffdcd6', ac: '#d6402f' },
    HLHH: { art: 'beijing', bg: '#ffe9cf', ac: '#c4452f' },
    HLHL: { art: 'wuhan', bg: '#ffe0ea', ac: '#d6457f' },
    HLLH: { art: 'chengdu', bg: '#e3f2df', ac: '#3f8f4a' },
    HLLL: { art: 'xian', bg: '#f6e1cf', ac: '#b0602a' },
    LHHH: { art: 'hefei', bg: '#d8f3ee', ac: '#1f9a88' },
    LHHL: { art: 'hangzhou', bg: '#e3f5d6', ac: '#4c9a2a' },
    LHLH: { art: 'xiamen', bg: '#fff3c4', ac: '#d99a00' },
    LHLL: { art: 'dali', bg: '#e3e6ff', ac: '#5a63d6' },
    LLHH: { art: 'guangzhou', bg: '#ffe6d6', ac: '#d9703a' },
    LLHL: { art: 'suzhou', bg: '#e2eaf3', ac: '#4f6f99' },
    LLLH: { art: 'nanjing', bg: '#f3ead2', ac: '#9a7a2a' },
    LLLL: { art: 'jingdezhen', bg: '#e3ecff', ac: '#2f55b8' }
  },
  // 隐藏款：特殊作答方式触发，替换结果页主角（按顺序判定）
  hidden: {
    mystery: { art: 'mystery', bg: '#e8eef9', ac: '#4a6fb3' },
    echo: { art: 'echo', bg: '#fff1b8', ac: '#c98a00' },
    rebel: { art: 'rebel', bg: '#e6e6ef', ac: '#4a4a66' },
  },
  hiddenOrder: ['mystery', 'echo', 'rebel'],
  // 彩蛋卡：收藏在图鉴里，不改变结果
  eggs: {
    speed: { art: 'speed', bg: '#e8f8d0', ac: '#5e9a2a' },
    sloth: { art: 'sloth', bg: '#fbe3f1', ac: '#c94d93' },
    night: { art: 'night', bg: '#e3dcff', ac: '#5b46b8' },
    early: { art: 'early', bg: '#e0f5ec', ac: '#2f9a6a' },
    again: { art: 'again', bg: '#ffe3d8', ac: '#e0603a' },
    twin: { art: 'twin', bg: '#ffeccf', ac: '#d9900f' },
    shiny: { art: 'shiny', bg: '#fff6c9', ac: '#c79a00' },
    petter: { art: 'petter', bg: '#ffe3ef', ac: '#d94f8a' },
    weekend: { art: 'weekend', bg: '#d8f3ee', ac: '#1f9a88' },
    bilingual: { art: 'bilingual', bg: '#ece3fb', ac: '#7d55c9' }
  },
  eggOrder: ['speed', 'sloth', 'night', 'early', 'again', 'twin', 'shiny', 'petter', 'weekend', 'bilingual'],
  rules: {
    mysteryNeutral: 15,   // ≥15 题选"说不好"
    echoAgree: 23,        // ≥23 题选同意（4 或 5）
    rebelDisagree: 23,    // ≥23 题选不同意（1 或 2）
    speedMs: 50000, slothMs: 360000, petterTaps: 30, againRuns: 3
  },
  // 两座城的关系：按"哪几个维度不同"（E O C A，1=不同）给基础默契值
  // 口味和人情一致、热闹与节奏互补最合拍（1010 最佳旅伴）；新旧口味不同又冷暖不同最爱斗嘴（0101）
  rel: {
    '0000': 90, '1000': 88, '0100': 84, '0010': 91, '0001': 86,
    '1100': 79, '1010': 96, '1001': 81, '0110': 80, '0101': 77, '0011': 83,
    '1110': 74, '1101': 72, '1011': 76, '0111': 73, '1111': 70
  },
  circle: ['1010', '0000', '0101', '0010', '1000', '1111'],
  refs: [
    { cite: 'Rentfrow, P. J., Gosling, S. D., & Potter, J. (2008). A theory of the emergence, persistence, and expression of geographic variation in psychological characteristics. Perspectives on Psychological Science, 3(5), 339–369.', doi: '10.1111/j.1745-6924.2008.00084.x' },
    { cite: 'Rentfrow, P. J., Gosling, S. D., Jokela, M., Stillwell, D. J., Kosinski, M., & Potter, J. (2013). Divided we stand: Three psychological regions of the United States and their political, economic, social, and health correlates. Journal of Personality and Social Psychology, 105(6), 996–1012.', doi: '10.1037/a0034434' },
    { cite: 'Bleidorn, W., Schönbrodt, F., Gebauer, J. E., Rentfrow, P. J., Potter, J., & Gosling, S. D. (2016). To live among like-minded others: Exploring the links between person-city personality fit and self-esteem. Psychological Science, 27(3), 419–427.', doi: '10.1177/0956797615627133' },
    { cite: 'Jokela, M., Bleidorn, W., Lamb, M. E., Gosling, S. D., & Rentfrow, P. J. (2015). Geographically varying associations between personality and life satisfaction in the London metropolitan area. Proceedings of the National Academy of Sciences, 112(3), 725–730.', doi: '10.1073/pnas.1415800112' },
    { cite: 'Wei, W., Lu, J. G., Galinsky, A. D., Wu, H., Gosling, S. D., Rentfrow, P. J., et al. (2017). Regional ambient temperature is associated with human personality. Nature Human Behaviour, 1(12), 890–895.', doi: '10.1038/s41562-017-0240-0' },
    { cite: 'Talhelm, T., Zhang, X., Oishi, S., Shimin, C., Duan, D., Lan, X., & Kitayama, S. (2014). Large-scale psychological differences within China explained by rice versus wheat agriculture. Science, 344(6184), 603–608.', doi: '10.1126/science.1246850' },
    { cite: 'Goldberg, L. R., Johnson, J. A., Eber, H. W., Hogan, R., Ashton, M. C., Cloninger, C. R., & Gough, H. G. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.', doi: '10.1016/j.jrp.2005.08.007' },
    { cite: 'Donnellan, M. B., Oswald, F. L., Baird, B. M., & Lucas, R. E. (2006). The Mini-IPIP scales: Tiny-yet-effective measures of the Big Five factors of personality. Psychological Assessment, 18(2), 192–203.', doi: '10.1037/1040-3590.18.2.192' },
    { cite: 'Likert, R. (1932). A technique for the measurement of attitudes. Archives of Psychology, 22(140), 1–55.', doi: '' },
    { cite: 'Simms, L. J., Zelazny, K., Williams, T. F., & Bernstein, L. (2019). Does the number of response options matter? Psychometric perspectives using personality questionnaire data. Psychological Assessment, 31(4), 557–566.', doi: '10.1037/pas0000648' },
    { cite: 'Haslam, N., Holland, E., & Kuppens, P. (2012). Categories versus dimensions in personality and psychopathology: A quantitative review of taxometric research. Psychological Medicine, 42(5), 903–920.', doi: '10.1017/S0033291711001966' },
    { cite: 'Forer, B. R. (1949). The fallacy of personal validation: A classroom demonstration of gullibility. Journal of Abnormal and Social Psychology, 44(1), 118–123.', doi: '10.1037/h0059240' },
    { cite: 'Baumgartner, H., & Steenkamp, J.-B. E. M. (2001). Response styles in marketing research: A cross-national investigation. Journal of Marketing Research, 38(2), 143–156.', doi: '10.1509/jmkr.38.2.143.18840' },
    { cite: 'Van Vaerenbergh, Y., & Thomas, T. D. (2013). Response styles in survey research: A literature review of antecedents, consequences, and remedies. International Journal of Public Opinion Research, 25(2), 195–217.', doi: '10.1093/ijpor/eds021' },
    { cite: 'Butcher, J. N., Graham, J. R., Ben-Porath, Y. S., Tellegen, A., Dahlstrom, W. G., & Kaemmer, B. (2001). MMPI-2: Manual for administration, scoring, and interpretation (Rev. ed.). University of Minnesota Press.' }
  ]
};
