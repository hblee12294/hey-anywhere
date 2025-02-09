// Collection of quotes in different languages
const quotes = {
  english: [
    "The greatest glory in living lies not in never falling, but in rising every time we fall. Our greatest weakness lies in giving up. The surest way to succeed is always to try just one more time.",
    "Life is like riding a bicycle. To keep your balance, you must keep moving. The only way to do great work is to love what you do.",
    "Education is not preparation for life; education is life itself. What we learn with pleasure we never forget. The beautiful thing about learning is that no one can take it away from you.",
    "Success usually comes to those who are too busy to be looking for it. The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.",
    "The future depends on what you do today. Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.",
  ],
  chinese: [
    "生活中最大的光荣不在于从不跌倒，而在于每次跌倒后都能站起来。失败是成功之母，坚持就是胜利。",
    "人生就像骑自行车，要保持平衡就要不断前进。成功的秘诀是坚持目标不动摇。生命不息，奋斗不止。",
    "教育不是为生活做准备，教育就是生活本身。学习是一个永无止境的过程，让我们在学习中不断成长。",
    "机会总是留给有准备的人。成功不是偶然的，而是来自于不懈的努力和坚持不懈的追求。",
    "今天的太阳永远新鲜，今天的生活永远崭新。把握今天，创造未来，让生活更加美好。",
  ],
  japanese: [
    "人生最大の栄光は、決して落ちないことではなく、落ちるたびに立ち上がることにある。失敗は成功の母であり、諦めないことが成功への道である。",
    "人生は自転車に乗るようなものです。バランスを保つためには、常に前に進まなければなりません。成功の秘訣は目標を持ち続けることです。",
    "教育は人生の準備ではなく、教育そのものが人生です。学びは終わりのない旅であり、私たちは学びの中で成長し続けます。",
    "チャンスは準備している人にやってくる。成功は偶然ではなく、たゆまぬ努力と追求の結果である。",
    "今日という日は新しい始まり。未来は今日の行動にかかっている。一日一日を大切に生きていこう。",
  ],
  german: [
    "Der größte Ruhm im Leben liegt nicht darin, nie zu fallen, sondern jedes Mal wieder aufzustehen. Unsere größte Schwäche liegt im Aufgeben. Der sicherste Weg zum Erfolg ist es, immer wieder einen neuen Versuch zu wagen.",
    "Das Leben ist wie Fahrradfahren. Um die Balance zu halten, musst du in Bewegung bleiben. Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was du tust.",
    "Bildung ist nicht die Vorbereitung auf das Leben; Bildung ist das Leben selbst. Was wir mit Freude lernen, vergessen wir nie.",
    "Erfolg kommt meist zu denen, die zu beschäftigt sind, um danach zu suchen. Der Unterschied zwischen einem erfolgreichen Menschen und anderen liegt nicht im Mangel an Stärke oder Wissen, sondern im Mangel an Willen.",
    "Die Zukunft hängt davon ab, was du heute tust. Gestern ist Geschichte, morgen ist ein Geheimnis, aber heute ist ein Geschenk.",
  ],
  french: [
    "La plus grande gloire n'est pas de ne jamais tomber, mais de se relever à chaque chute. Notre plus grande faiblesse réside dans l'abandon. Le moyen le plus sûr de réussir est toujours d'essayer une fois de plus.",
    "La vie est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre. La seule façon de faire du bon travail est d'aimer ce que vous faites.",
    "L'éducation n'est pas une préparation à la vie; l'éducation est la vie même. Ce que nous apprenons avec plaisir, nous ne l'oublions jamais.",
    "Le succès vient généralement à ceux qui sont trop occupés pour le chercher. La différence entre une personne qui réussit et les autres n'est pas le manque de force ni le manque de connaissances, mais plutôt le manque de volonté.",
    "L'avenir dépend de ce que vous faites aujourd'hui. Hier est de l'histoire, demain est un mystère, mais aujourd'hui est un cadeau.",
  ],
  arabic: [
    "المجد الأعظم في الحياة لا يكمن في عدم السقوط، بل في النهوض في كل مرة نسقط فيها. أعظم ضعف لدينا هو الاستسلام. الطريق الأكيد للنجاح هو المحاولة مرة أخرى.",
    "الحياة مثل ركوب الدراجة، للحفاظ على توازنك يجب أن تستمر في التحرك. الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.",
    "التعليم ليس إعداداً للحياة؛ التعليم هو الحياة نفسها. ما نتعلمه بمتعة لا ننساه أبداً. الشيء الجميل في التعلم هو أنه لا يمكن لأحد أن يأخذه منك.",
    "النجاح يأتي عادة لأولئك المشغولين جداً عن البحث عنه. الفرق بين الشخص الناجح والآخرين ليس في نقص القوة أو نقص المعرفة، بل في نقص الإرادة.",
    "المستقبل يعتمد على ما تفعله اليوم. الأمس تاريخ، والغد غامض، لكن اليوم هدية. لذلك يسمى الحاضر.",
  ],
};

// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  // Create parent menu item
  chrome.contextMenus.create({
    id: "say_hey",
    title: "Hey",
    contexts: ["editable"],
  });

  // Create language submenu items
  chrome.contextMenus.create({
    id: "hey_english",
    parentId: "say_hey",
    title: "English",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "hey_chinese",
    parentId: "say_hey",
    title: "Chinese",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "hey_japanese",
    parentId: "say_hey",
    title: "Japanese",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "hey_german",
    parentId: "say_hey",
    title: "German",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "hey_french",
    parentId: "say_hey",
    title: "French",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "hey_arabic",
    parentId: "say_hey",
    title: "Arabic",
    contexts: ["editable"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("hey_")) {
    // Extract language from menu item ID
    const language = info.menuItemId.replace("hey_", "");

    // Get random quote from selected language
    const languageQuotes = quotes[language];
    const randomQuote =
      languageQuotes[Math.floor(Math.random() * languageQuotes.length)];

    // Send quote to content script
    chrome.tabs.sendMessage(tab.id, {
      action: "fillQuote",
      quote: randomQuote,
    });
  }
});
