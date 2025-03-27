const config = {
  type: Phaser.AUTO,
  width: 1520,
  height: 680,
  transparent: true,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let questions = [
  {
    question: "assets/perguntas/pergunta1.png",
    answers: [
      { text: "12345678", correct: false },
      { text: "Brasil123", correct: false },
      { text: "segura@#", correct: false },
      { text: "BpeGw928#", correct: true },
    ],
    character: "character1",
    correctImage: "assets/feedback/acertou1.png",
    wrongImage: "assets/feedback/erro1.png",
  },
  {
    question: "assets/perguntas/pergunta2.png",
    answers: [
      { text: "Identidade", correct: false },
      { text: "Biometria", correct: false },
      { text: "Primeiro nome", correct: true },
      { text: "Histórico de saúde", correct: false },
    ],
    character: "character2",
    correctImage: "assets/feedback/acertou2.png",
    wrongImage: "assets/feedback/erro2.png",
  },
  {
    question: "assets/perguntas/pergunta3.png",
    answers: [
      {
        text: "Seus dados serão protegidos e você pode revogar o consentimento a qualquer momento.",
        correct: false,
      },
      {
        text: "Você concorda em compartilhar todos os seus dados, incluindo bancários, sem restrições.",
        correct: true,
      },
      {
        text: "Os dados coletados serão usados apenas para personalizar sua experiência.",
        correct: false,
      },
      {
        text: "Você pode acessar e excluir seus dados a qualquer momento.",
        correct: false,
      },
    ],
    character: "character3",
    correctImage: "assets/feedback/acertou3.png",
    wrongImage: "assets/feedback/erro3.png",
  },
  {
    question: "assets/perguntas/pergunta4.png",
    answers: [
      {
        text: "Clicar no link e inserir as informações rapidamente para garantir segurança.",
        correct: false,
      },
      { text: "Ignorar o e-mail e denunciar como phishing.", correct: true },
      {
        text: "Responder o e-mail perguntando mais detalhes sobre o problema.",
        correct: false,
      },
      {
        text: "Compartilhar o link com um amigo para verificar se é confiável.",
        correct: false,
      },
    ],
    character: "character4",
    correctImage: "assets/feedback/acertou4.png",
    wrongImage: "assets/feedback/erro4.png",
  },
  {
    question: "assets/perguntas/pergunta5.png",
    answers: [
      {
        text: "Usar sempre a mesma senha em todas as contas para facilitar o acesso.",
        correct: false,
      },
      {
        text: "Ativar a autenticação em dois fatores e revisar as permissões de aplicativos conectados.",
        correct: true,
      },
      {
        text: "Não usar senha e confiar que os serviços online são seguros.",
        correct: false,
      },
      {
        text: "Salvar todas as senhas em um arquivo de texto no computador para não esquecê-las.",
        correct: false,
      },
    ],
    character: "character5",
    correctImage: "assets/feedback/acertou5.png",
    wrongImage: "assets/feedback/erro5.png",
  },
];

let currentQuestionIndex = 0;
let score = 0;
let questionImage,
  characterSprite,
  answerButtons = [];
let feedbackImage;
let hearts = [];
let lives = 5;
let correctSound, wrongSound, victorySound, nextSound;

function preload() {
  this.load.image("gameOverImage", "assets/gameover.png");
  this.load.image("victoryImage", "assets/victory.png");
  this.load.image("restartButtonImage", "assets/recomeçar.png");

  questions.forEach((q, index) => {
    this.load.image(`question${index}`, q.question);
    this.load.image(`correct${index}`, q.correctImage);
    this.load.image(`wrong${index}`, q.wrongImage);
  });

  // Carrega os spritesheets corretamente
  this.load.spritesheet("character1", "assets/character1.png", {
    frameWidth: 1600,
    frameHeight: 1600,
  });
  this.load.spritesheet("character2", "assets/character2.png", {
    frameWidth: 1600,
    frameHeight: 1600,
  });
  this.load.spritesheet("character3", "assets/character3.png", {
    frameWidth: 1600,
    frameHeight: 1600,
  });
  this.load.spritesheet("character4", "assets/character4.png", {
    frameWidth: 1600,
    frameHeight: 1600,
  });
  this.load.spritesheet("character5", "assets/character5.png", {
    frameWidth: 1600,
    frameHeight: 1600,
  });

  this.load.image("nextButton", "assets/proxima.png");
  this.load.image("closeButton", "assets/entendido.png");
  this.load.image("heart", "assets/heart.png");

  this.load.audio("correctSound", "assets/sons/certo.mp3");
  this.load.audio("wrongSound", "assets/sons/erro.mp3");
  this.load.audio("victorySound", "assets/sons/vitória.mp3");
  this.load.audio("nextSound", "assets/sons/próxima.mp3");
}

function create() {
  this.anims.create({
    key: "character1_anim",
    frames: this.anims.generateFrameNumbers("character1", { start: 0, end: 3 }),
    frameRate: 3.5,
    repeat: -1,
  });

  this.anims.create({
    key: "character2_anim",
    frames: this.anims.generateFrameNumbers("character2", { start: 0, end: 3 }),
    frameRate: 3.5,
    repeat: -1,
  });

  this.anims.create({
    key: "character3_anim",
    frames: this.anims.generateFrameNumbers("character3", { start: 0, end: 3 }),
    frameRate: 3.5,
    repeat: -1,
  });

  this.anims.create({
    key: "character4_anim",
    frames: this.anims.generateFrameNumbers("character4", { start: 0, end: 3 }),
    frameRate: 3.5,
    repeat: -1,
  });

  this.anims.create({
    key: "character5_anim",
    frames: this.anims.generateFrameNumbers("character5", { start: 0, end: 3 }),
    frameRate: 3.5,
    repeat: -1,
  });

  for (let i = 0; i < lives; i++) {
    const heart = this.add
      .image(this.scale.width - 50 - i * 50, 50, "heart")
      .setScale(0.05);
    hearts.push(heart);
  }
  correctSound = this.sound.add("correctSound");
  wrongSound = this.sound.add("wrongSound");
  victorySound = this.sound.add("victorySound");
  nextSound = this.sound.add("nextSound");

  showQuestion(this);
}

function update() {}

function showQuestion(scene) {
  scene.children.removeAll();

  const currentQuestion = questions[currentQuestionIndex];

  questionImage = scene.add
    .image(
      scene.scale.width / 2,
      scene.scale.height * 0.2,
      `question${currentQuestionIndex}`
    )
    .setScale(0.2);

  if (characterSprite) {
    characterSprite.destroy();
  }

  characterSprite = scene.add
    .sprite(
      scene.scale.width * 0.15,
      scene.scale.height * 0.7,
      currentQuestion.character
    )
    .setScale(0.5)
    .play(`${currentQuestion.character}_anim`);

  answerButtons = [];
  const columnX = [scene.scale.width * 0.35, scene.scale.width * 0.65];
  const rowY = [scene.scale.height * 0.5, scene.scale.height * 0.6];

  currentQuestion.answers.forEach((answer, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);

    const container = scene.add
      .rectangle(columnX[column], rowY[row], 200, 50, 0x333333, 1)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xffffff);

    const buttonText = scene.add
      .text(columnX[column], rowY[row], answer.text, {
        fontSize: "16px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 180 },
      })
      .setOrigin(0.5);

    container
      .setInteractive()
      .on("pointerdown", () => selectAnswer(scene, answer));

    buttonText
      .setInteractive()
      .on("pointerdown", () => selectAnswer(scene, answer));

    answerButtons.push({ container, buttonText });
  });
}

function selectAnswer(scene, answer) {
  const currentQuestion = questions[currentQuestionIndex];

  answerButtons.forEach(({ container, buttonText }) => {
    container.destroy();
    buttonText.destroy();
  });

  if (answer.correct) {
    // Toca o som de resposta correta
    correctSound.play();

    score++;
    feedbackImage = scene.add
      .image(
        scene.scale.width / 2,
        scene.scale.height / 2,
        `correct${currentQuestionIndex}`
      )
      .setScale(0.15);

    const nextButton = scene.add
      .image(scene.scale.width * 0.7, scene.scale.height * 0.8, "nextButton")
      .setScale(0.2)
      .setInteractive()
      .on("pointerdown", () => {
        // Toca o som de próximo
        nextSound.play();

        feedbackImage.destroy();
        nextButton.destroy();
        nextQuestion(scene);
      });
  } else {
    // Toca o som de resposta errada
    wrongSound.play();

    feedbackImage = scene.add
      .image(
        scene.scale.width / 2,
        scene.scale.height / 2,
        `wrong${currentQuestionIndex}`
      )
      .setScale(0.15);

    if (lives > 0) {
      const heart = hearts.pop();
      heart.destroy();
      lives--;
    }

    if (lives === 0) {
      endGame(scene, true);
      return;
    }

    const closeButton = scene.add
      .image(scene.scale.width * 0.68, scene.scale.height * 0.76, "closeButton")
      .setScale(0.2)
      .setInteractive()
      .on("pointerdown", () => {
        feedbackImage.destroy();
        closeButton.destroy();

        showQuestion(scene);
      });
  }
}

function nextQuestion(scene) {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(scene);
  } else {
    endGame(scene, false);
  }
}

function endGame(scene, isGameOver) {
  scene.children.removeAll();

  if (isGameOver) {
    // Toca o som de "Game Over"
    victorySound.play();
  }

  // Exibe uma imagem de "Game Over" ou "Vitória"
  const endImage = isGameOver
    ? scene.add.image(
        scene.scale.width / 2,
        scene.scale.height / 2,
        "gameOverImage"
      )
    : scene.add.image(
        scene.scale.width / 2,
        scene.scale.height / 2,
        "victoryImage"
      );

  endImage.setScale(0.5); // Ajuste o tamanho da imagem conforme necessário

  // Adiciona um botão de reiniciar como imagem
  const restartButton = scene.add
    .image(
      scene.scale.width / 2,
      scene.scale.height * 0.8,
      "restartButtonImage"
    )
    .setScale(0.2) // Ajuste o tamanho do botão conforme necessário
    .setInteractive()
    .on("pointerdown", () => {
      currentQuestionIndex = 0;
      score = 0;
      lives = 5;
      hearts.forEach((heart) => heart.destroy());
      hearts = [];
      create.call(scene); // Reinicia o jogo
    });
}
