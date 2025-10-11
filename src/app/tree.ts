export const tree: {
  [key: string]: {
    animation?: string;
    comp?: string;
    next?: string;
    japanese?: string;
    romaji?: string;
    back_to_home?: boolean;
    options?: {
      user?: string;
      japanese?: string;
      romaji?: string;
      next?: string;
    }[];
  };
} = {
  order_qn: {
    comp: "What do you want to [order]?",
    japanese: "何を[注文]しますか？",
    romaji: "nani wo [chūmon] shimasu ka?",
    options: [
      {
        user: "I [want] ramen",
        japanese: "ラーメンが[欲しい]です",
        romaji: "rāmen ga [hoshii] desu",
        next: "client_wants_chicken_rice",
      },
      {
        user: "Please wait while I [think]",
        japanese: "考えています",
        romaji: "kangaete [imasu]",
        next: "client_thinking",
      },
    ],
  },
  client_wants_chicken_rice: {
    comp: "[How many] ramen do you want?",
    japanese: "ラーメンは[何個]欲しいですか？",
    romaji: "rāmen wa [nanko] hoshii desu ka?",
    options: [
      {
        user: "Just [one] please",
        japanese: "一つお願いします",
        romaji: "[hitotsu] onegaishimasu",
        next: "anything_else",
      },
      {
        user: "[Two] please",
        japanese: "二つお願いします",
        romaji: "[futatsu] onegaishimasu",
        next: "anything_else",
      },
    ],
  },
  client_thinking: {
    comp: "[Okay]",
    japanese: "了解",
    romaji: "[ryōkai]",
    next: "order_qn",
  },
  anything_else: {
    comp: "[Anything else]?",
    japanese: "他に何かほしいですか？",
    romaji: "[hoka ni] nani ka hoshii desu ka?",
    options: [
      {
        user: "[Yes]",
        japanese: "はい",
        romaji: "[hai]",
        next: "order_qn",
      },
      {
        user: "[No]",
        japanese: "いいえ",
        romaji: "[iie]",
        next: "thank_you",
      },
    ],
  },
  thank_you: {
    comp: "[Thank you] for your order!",
    japanese: "ご注文ありがとうございます！",
    romaji: "go chūmon [arigatō gozaimasu]!",
    next: "wait_order",
  },
  wait_order: {
    comp: "Preparing your order...",
    animation: "cooking.gif",
    next: "heres_food",
  },
  heres_food: {
    comp: "Here's your food!",
    japanese: "これはあなたの食べ物です",
    romaji: "kore wa anata no tabemono desu",
    options: [
      {
        user: "[Thank you]",
        japanese: "ありがとうございます",
        romaji: "[arigatō] gozaimasu",
        next: "youre_welcome",
      },
    ],
  },
  youre_welcome: {
    comp: "[You're welcome]",
    japanese: "どういたしまして",
    romaji: "[dō itashimashite]",
    next: "eating",
  },
  eating: {
    comp: "Eating your food...",
    animation: "eating.gif",
    next: "finished_eating",
  },
  finished_eating: {
    comp: "",
    romaji: "",
    options: [
      {
        user: "Can I have the [bill] please?",
        japanese: "請求書をお願いします",
        romaji: "[Seikyuusho] o onegaishimasu",
        next: "paying",
      },
    ],
  },
  paying: {
    comp: "Yes, how would you like to [pay]?",
    japanese: "どうぞお支払いください",
    romaji: "[dōzo] o shiharai kudasai",
    options: [
      {
        user: "[Cash]",
        japanese: "現金",
        romaji: "[genkin]",
        next: "thank_you_5",
      },
      {
        user: "[Card]",
        japanese: "カード",
        romaji: "[kādo]",
        next: "thank_you_5",
      },
    ],
  },
  thank_you_5: {
    comp: "Thanks for [coming]!",
    japanese: "ご来店ありがとうございます！",
    romaji: "go ryōten [arigatō gozaimasu]!",
    options: [
      {
        user: "[Thank you for the meal]",
        japanese: "ごちそうさまでした",
        romaji: "[Gochisousama deshita]",
        next: "end",
      },
      {
        user: "[Thank you]",
        japanese: "ありがとうございます",
        romaji: "[Arigatō gozaimasu]",
        next: "end",
      },
    ],
  },
  end: {
    comp: "Congratulations! You've learned how to order food in Japanese!",
    animation: "yay.gif",
    back_to_home: true,
  },
};
