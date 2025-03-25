const config = {
  type: Phaser.AUTO,
  width: 1350,
  height: 620,
  backgroundColor: "#000000",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let questions = [
  {
    question: "assets/pergunta1.png",
    answers: [
      { text: "12345678", correct: false },
      { text: "Brasil123", correct: false },
      { text: "segura@#", correct: false },
      { text: "BpeGw928#", correct: true },
    ],
    character: "character1",
    correctImage: "assets/acertou1.png",
    wrongImage: "assets/erro1.png",
  },
  {
    question: "assets/pergunta2.png",
    answers: [
      { text: "ERRADA", correct: false },
      { text: "ERRADA", correct: false },
      { text: "ERRADA", correct: false },
      { text: "CORRETA", correct: true },
    ],
    character: "character2",
    correctImage: "assets/correct2.png",
    wrongImage: "assets/erro2.png",
  },
  {
    question: "assets/pergunta3.png",
    answers: [
      { text: "A-) ERRADA", correct: false },
      { text: "B-) ERRADA", correct: false },
      { text: "C-) ERRADA", correct: false },
      { text: "D-) CORRETA", correct: true },
    ],
    character: "character3",
    correctImage: "assets/acertou3.png",
    wrongImage: "assets/erro3.png",
  },
  {
    question: "assets/pergunta4.png",
    answers: [
      { text: "A-) ERRADA", correct: false },
      { text: "B-) ERRADA", correct: false },
      { text: "C-) ERRADA", correct: false },
      { text: "D-) CORRETA", correct: true },
    ],
    character: "character4",
    correctImage: "assets/acertou4.png",
    wrongImage: "assets/erro4.png",
  },
  {
    question: "assets/pergunta5.png",
    answers: [
      { text: "A-) ERRADA", correct: false },
      { text: "B-) ERRADA", correct: false },
      { text: "C-) ERRADA", correct: false },
      { text: "D-) CORRETA", correct: true },
    ],
    character: "character5",
    correctImage: "assets/acertou5.png",
    wrongImage: "assets/erro5.png",
  },
];

let currentQuestionIndex = 0;
let score = 0;
let questionImage,
  characterSprite,
  answerButtons = [];
let feedbackImage;

function preload() {
  // Carrega as imagens das perguntas e feedback
  questions.forEach((q, index) => {
    this.load.image(`question${index}`, q.question);
    this.load.image(`correct${index}`, q.correctImage);
    this.load.image(`wrong${index}`, q.wrongImage);
  });

  // Carrega os spritesheets dos personagens
  this.load.spritesheet("character1", "assets/character1.png", {
    frameWidth: 3200,
    frameHeight: 420,
  });
  this.load.spritesheet("character2", "assets/character2.png", {
    frameWidth: 3200,
    frameHeight: 420,
  });
  this.load.spritesheet("character3", "assets/character3.png", {
    frameWidth: 3200,
    frameHeight: 420,
  });
  this.load.spritesheet("character4", "assets/character4.png", {
    frameWidth: 3200,
    frameHeight: 420,
  });
  this.load.spritesheet("character5", "assets/character5.png", {
    frameWidth: 3200,
    frameHeight: 420,
  });
}

function create() {
  // Cria animações para os personagens
  questions.forEach((index) => {
    this.anims.create({
      key: `character${index}_anim`,
      frames: this.anims.generateFrameNumbers(`character${index}`, {
        start: 0,
        end: 1, // Número de frames no spritesheet
      }),
      frameRate: 0.5, // Velocidade da animação
      repeat: -1, // Loop infinito
    });
  });

  // Mostra a primeira pergunta
  showQuestion(this);
}

function update() {}

function showQuestion(scene) {
  // Limpa a tela
  scene.children.removeAll();

  const currentQuestion = questions[currentQuestionIndex];

  // Exibe a imagem da pergunta
  questionImage = scene.add
    .image(
      scene.scale.width / 1.9,
      scene.scale.height * 0.25,
      `question${currentQuestionIndex}`
    )
    .setScale(0.15);

  // Exibe o personagem animado
  characterSprite = scene.add
    .sprite(
      scene.scale.width * 0.025,
      scene.scale.height * 0.7,
      currentQuestion.character
    )
    .setScale(0.5);
  characterSprite.play(`${currentQuestion.character}_anim`);

  // Exibe as respostas como botões
  answerButtons = [];
  currentQuestion.answers.forEach((answer, index) => {
    const button = scene.add
      .text(
        scene.scale.width / 1.6,
        scene.scale.height * 0.4 + index * 50,
        answer.text,
        {
          fontSize: "24px",
          color: "#ffffff",
          backgroundColor: "#333333",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => selectAnswer(scene, answer));
    answerButtons.push(button);
  });
}

function selectAnswer(scene, answer) {
  const currentQuestion = questions[currentQuestionIndex];

  // Remove os botões de resposta
  answerButtons.forEach((button) => button.destroy());

  if (answer.correct) {
    score++;
    feedbackImage = scene.add
      .image(
        scene.scale.width / 2,
        scene.scale.height / 2,
        `correct${currentQuestionIndex}`
      )
      .setScale(0.5);
  } else {
    feedbackImage = scene.add
      .image(
        scene.scale.width / 2,
        scene.scale.height / 2,
        `wrong${currentQuestionIndex}`
      )
      .setScale(0.5);
  }

  // Adiciona um botão para avançar para a próxima pergunta
  const nextButton = scene.add
    .text(scene.scale.width / 2, scene.scale.height * 0.9, "Próxima Pergunta", {
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#333333",
      padding: { x: 10, y: 5 },
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => {
      feedbackImage.destroy();
      nextButton.destroy();
      nextQuestion(scene);
    });
}

function nextQuestion(scene) {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(scene);
  } else {
    endGame(scene);
  }
}

function endGame(scene) {
  // Limpa a tela
  scene.children.removeAll();

  // Exibe a pontuação final
  scene.add
    .text(
      scene.scale.width / 2,
      scene.scale.height / 2,
      `Você acertou ${score} de ${questions.length} perguntas!`,
      {
        fontSize: "32px",
        color: "#ffffff",
      }
    )
    .setOrigin(0.5);

  // Adiciona um botão para reiniciar o jogo
  const restartButton = scene.add
    .text(scene.scale.width / 2, scene.scale.height * 0.6, "Reiniciar Jogo", {
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#333333",
      padding: { x: 10, y: 5 },
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => {
      currentQuestionIndex = 0;
      score = 0;
      showQuestion(scene);
    });
}
