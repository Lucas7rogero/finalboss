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
let lives = 5; // Número inicial de corações
let questionImage,
  characterSprite,
  answerButtons = [];
let feedbackImage;
let timerText; // Texto do cronômetro
let timer; // Variável para o cronômetro
let timeLeft = 180; // Tempo total em segundos (3 minutos)
let hearts = []; // Array para armazenar os corações

function preload() {
  // Carrega as imagens das perguntas e feedback
  questions.forEach((q, index) => {
    this.load.image(`question${index}`, q.question);
    this.load.image(`correct${index}`, q.correctImage);
    this.load.image(`wrong${index}`, q.wrongImage);
  });

  // Carrega os spritesheets dos personagens
  this.load.spritesheet("character1", "assets/character1.png", {
    frameWidth: 1600,
    frameHeight: 800,
  });
  this.load.spritesheet("character2", "assets/character2.png", {
    frameWidth: 1600,
    frameHeight: 800,
  });
  this.load.spritesheet("character3", "assets/character3.png", {
    frameWidth: 1600,
    frameHeight: 800,
  });
  this.load.spritesheet("character4", "assets/character4.png", {
    frameWidth: 1600,
    frameHeight: 800,
  });
  this.load.spritesheet("character5", "assets/character5.png", {
    frameWidth: 1600,
    frameHeight: 800,
  });

  this.load.image("heart", "assets/heart.png");
}

function create() {
  questions.forEach((index) => {
    this.anims.create({
      key: `character${index + 1}_anim`,
      frames: this.anims.generateFrameNumbers(`character${index + 1}`, {
        start: 0,
        end: 1,
      }),
      frameRate: 8,
      repeat: -1,
    });
  });

  // Adiciona o cronômetro no canto superior esquerdo
  timerText = this.add.text(20, 20, formatTime(timeLeft), {
    fontSize: "32px",
    color: "#ffffff",
  });

  // Adiciona os corações no canto superior direito
  for (let i = 0; i < lives; i++) {
    const heart = this.add.image(1350 - i * 50, 30, "heart").setScale(0.05);
    hearts.push(heart);
  }

  // Inicia o cronômetro
  timer = this.time.addEvent({
    delay: 1000, // 1 segundo
    callback: updateTimer,
    callbackScope: this,
    loop: true,
  });

  // Mostra a primeira pergunta
  showQuestion(this);
}

function update() {
  // Atualizações contínuas (se necessário)
}

function showQuestion(scene) {
  // Limpa a tela
  scene.children.removeAll();

  const currentQuestion = questions[currentQuestionIndex];

  // Exibe a imagem da pergunta
  questionImage = scene.add
    .image(
      scene.scale.width / 1.9,
      scene.scale.height * 0.27,
      `question${currentQuestionIndex}`
    )
    .setScale(0.09);

  // Exibe o personagem animado
  characterSprite = scene.add
    .sprite(
      scene.scale.width * 0.2,
      scene.scale.height * 0.1,
      currentQuestion.character
    )
    .setScale(1.5);
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

    // Adiciona o botão para avançar para a próxima pergunta
    const nextButton = scene.add
      .text(
        scene.scale.width / 2,
        scene.scale.height * 0.9,
        "Próxima Pergunta",
        {
          fontSize: "24px",
          color: "#ffffff",
          backgroundColor: "#333333",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        feedbackImage.destroy();
        nextButton.destroy();
        nextQuestion(scene);
      });
  } else {
    feedbackImage = scene.add
      .image(
        scene.scale.width / 2,
        scene.scale.height / 2,
        `wrong${currentQuestionIndex}`
      )
      .setScale(0.5);

    // Remove um coração
    if (lives > 0) {
      const heart = hearts.pop();
      heart.destroy();
      lives--;
    }

    // Se as vidas acabarem, encerra o jogo
    if (lives <= 0) {
      endGame(scene);
    }
  }
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
      lives = 5; // Reinicia as vidas
      timeLeft = 180; // Reinicia o cronômetro
      timer.paused = false; // Reinicia o evento do cronômetro
      hearts.forEach((heart) => heart.destroy()); // Remove corações antigos
      hearts = []; // Reseta o array de corações
      create.call(scene); // Recria os corações
    });
}

// Atualiza o cronômetro
function updateTimer() {
  timeLeft--;
  timerText.setText(formatTime(timeLeft));

  if (timeLeft <= 0) {
    timer.paused = true; // Pausa o cronômetro
    endGame(this); // Encerra o jogo
  }
}

// Formata o tempo no formato MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secondsLeft
    .toString()
    .padStart(2, "0")}`;
}
