class FinalBoss extends Phaser.Scene {
  constructor() {
    super("FinalBoss");
    this.questions = [
      {
        question: "assets/perguntas/pergunta1.svg",
        answers: [
          { text: "12345678", correct: false },
          { text: "Brasil123", correct: false },
          { text: "segura@#", correct: false },
          { text: "BpeGw928#", correct: true },
        ],
        character: "character1",
        correctImage: "assets/feedback/acertou1.png",
        wrongImage: "assets/feedback/erro1.png",
        background: "assets/fundos/background.png",
      },
      {
        question: "assets/perguntas/pergunta2.svg",
        answers: [
          { text: "Identidade", correct: false },
          { text: "Biometria", correct: false },
          { text: "Primeiro nome", correct: true },
          { text: "Histórico de saúde", correct: false },
        ],
        character: "character2",
        correctImage: "assets/feedback/acertou2.png",
        wrongImage: "assets/feedback/erro2.png",
        background: "assets/fundos/background2.png",
      },
      {
        question: "assets/perguntas/pergunta3.svg",
        answers: [
          {
            text: "Consentimento revogável garantido.",
            correct: false,
          },
          {
            text: "Compartilhar dados livremente.",
            correct: true,
          },
          {
            text: "Personalização com dados.",
            correct: false,
          },
          {
            text: "Acesso e exclusão garantidos.",
            correct: false,
          },
        ],
        character: "character3",
        correctImage: "assets/feedback/acertou3.png",
        wrongImage: "assets/feedback/erro3.png",
        background: "assets/fundos/background3.png",
      },
      {
        question: "assets/perguntas/pergunta4.svg",
        answers: [
          {
            text: "Clique e informe.",
            correct: false,
          },
          {
            text: "Denunciar como phishing.",
            correct: true,
          },
          {
            text: "Pedir mais detalhes.",
            correct: false,
          },
          {
            text: "Compartilhar para checar.",
            correct: false,
          },
        ],
        character: "character4",
        correctImage: "assets/feedback/acertou4.png",
        wrongImage: "assets/feedback/erro4.png",
        background: "assets/fundos/background2.png",
      },
      {
        question: "assets/perguntas/pergunta5.svg",
        answers: [
          {
            text: "Mesma senha sempre.",
            correct: false,
          },
          {
            text: "Ativar dois fatores.",
            correct: true,
          },
          {
            text: "Confiar sem senha.",
            correct: false,
          },
          {
            text: "Salvar em arquivo.",
            correct: false,
          },
        ],
        character: "character5",
        correctImage: "assets/feedback/acertou5.png",
        wrongImage: "assets/feedback/erro5.png",
        background: "assets/fundos/background.png",
      },
    ];

    this.currentQuestionIndex = 0;
    this.score = 0;
    this.lives = 5; // Número inicial de vidas
    this.hearts = []; // Array para armazenar os corações
    this.questionImage = null;
    this.characterSprite = null;
    this.answerButtons = [];
    this.feedbackImage = null;
    this.correctSound = null;
    this.wrongSound = null;
    this.victorySound = null;
    this.nextSound = null;
    this.backgroundImage = null;
  }

  preload() {
    this.load.image("gameOverImage", "assets/gameover.png");
    this.load.image("victoryImage", "assets/victory.png");
    this.load.image("restartButtonImage", "assets/recomeçar.png");
    this.load.image("answerBackground", "assets/alternativa.png");

    this.questions.forEach((q, index) => {
      this.load.image(`question${index}`, q.question);
      this.load.image(`correct${index}`, q.correctImage);
      this.load.image(`wrong${index}`, q.wrongImage);
      this.load.image(`background${index}`, q.background);
    });

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

    this.load.audio("correctSound", "assets/sons/certo.mp3");
    this.load.audio("wrongSound", "assets/sons/erro.mp3");
    this.load.audio("victorySound", "assets/sons/vitória.mp3");
    this.load.audio("gameOverSound", "assets/sons/gameover.mp3");
    this.load.audio("nextSound", "assets/sons/próxima.mp3");
  }

  create() {
    this.correctSound = this.sound.add("correctSound");
    this.wrongSound = this.sound.add("wrongSound");
    this.victorySound = this.sound.add("victorySound");
    this.nextSound = this.sound.add("nextSound");

    this.createLivesDisplay(); // Exibe as vidas na tela
    this.showQuestion();
  }

  createLivesDisplay() {
    // Remove os corações existentes
    this.hearts.forEach((heart) => heart.destroy());
    this.hearts = [];

    // Adiciona os corações como texto
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add
        .text(50 + i * 50, 25, "❤", {
          fontFamily: "Arial",
          fontSize: "50px",
          fill: "#f00", // Cor vermelha para os corações
        })
        .setDepth(10); // Garante que os corações fiquem na frente de outros elementos
      this.hearts.push(heart);
    }
  }

  showQuestion() {
    this.children.removeAll();

    this.createLivesDisplay(); // Garante que os corações sejam exibidos

    const currentQuestion = this.questions[this.currentQuestionIndex];

    if (this.backgroundImage) {
      this.backgroundImage.destroy();
    }
    this.backgroundImage = this.add
      .image(
        this.scale.width / 2,
        this.scale.height / 2,
        `background${this.currentQuestionIndex}`
      )
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(0);

    this.questionImage = this.add
      .image(
        this.scale.width / 2,
        this.scale.height * 0.2,
        `question${this.currentQuestionIndex}`
      )
      .setScale(0.55)
      .setDepth(2);

    if (this.characterSprite) {
      this.characterSprite.destroy();
    }

    this.characterSprite = this.add
      .sprite(
        this.scale.width * 0.15,
        this.scale.height * 0.7,
        currentQuestion.character
      )
      .setScale(1.1)
      .play(`${currentQuestion.character}_anim`)
      .setDepth(2);

    this.answerButtons = [];
    const columnX = [this.scale.width * 0.35, this.scale.width * 0.65];
    const rowY = [this.scale.height * 0.5, this.scale.height * 0.65];

    currentQuestion.answers.forEach((answer, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);

      const background = this.add
        .image(columnX[column], rowY[row], "answerBackground")
        .setOrigin(0.5)
        .setScale(0.3)
        .setDepth(2);

      const buttonText = this.add
        .text(columnX[column], rowY[row], answer.text, {
          fontSize: "32px",
          fontWeight: "bold",
          fontFamily: "vcr osd mono",
          color: "#000000",
          align: "center",
          wordWrap: { width: 180 },
        })
        .setOrigin(0.5)
        .setDepth(3);

      buttonText
        .setInteractive()
        .on("pointerdown", () => this.selectAnswer(answer));

      this.answerButtons.push({ background, buttonText });
    });
  }

  selectAnswer(answer) {
    if (answer.correct) {
      this.correctSound.play();
      this.score++;
      this.feedbackImage = this.add
        .image(
          this.scale.width / 2,
          this.scale.height / 2,
          `correct${this.currentQuestionIndex}`
        )
        .setScale(0.15)
        .setDepth(200);

      const nextButton = this.add
        .image(this.scale.width * 0.7, this.scale.height * 0.8, "nextButton")
        .setScale(0.2)
        .setInteractive()
        .setDepth(201)
        .on("pointerdown", () => {
          this.nextSound.play();
          this.feedbackImage.destroy();
          nextButton.destroy();
          this.addTransition(() => this.nextQuestion());
        });
    } else {
      this.wrongSound.play();
      this.feedbackImage = this.add
        .image(
          this.scale.width / 2,
          this.scale.height / 2,
          `wrong${this.currentQuestionIndex}`
        )
        .setScale(0.15)
        .setDepth(200);

      this.lives--; // Reduz uma vida
      this.createLivesDisplay(); // Atualiza a exibição das vidas

      if (this.lives === 0) {
        this.endGame(true);
        return;
      }

      const closeButton = this.add
        .image(this.scale.width * 0.68, this.scale.height * 0.76, "closeButton")
        .setScale(0.2)
        .setInteractive()
        .setDepth(201)
        .on("pointerdown", () => {
          this.feedbackImage.destroy();
          closeButton.destroy();
          this.showQuestion();
        });
    }
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.showQuestion();
    } else {
      this.endGame(false);
    }
  }

  endGame(isGameOver) {
    this.children.removeAll();

    const endImage = isGameOver
      ? this.add.image(
          this.scale.width / 2,
          this.scale.height / 2,
          "gameOverImage"
        )
      : this.add.image(
          this.scale.width / 2,
          this.scale.height / 2,
          "victoryImage"
        );

    endImage.setScale(isGameOver ? 0.5 : 2.0);

    // Reproduz o som de vitória apenas na tela de vitória
    if (!isGameOver) {
      this.victorySound.play();
    }

    const restartButton = this.add
      .image(
        this.scale.width / 2,
        this.scale.height * 0.8,
        "restartButtonImage"
      )
      .setScale(0.2)
      .setInteractive()
      .on("pointerdown", () => {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.lives = 5; // Reinicia as vidas
        this.create();
      });
  }

  addTransition(callback) {
    const transition = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        this.scale.width,
        this.scale.height,
        0x000000
      )
      .setAlpha(0)
      .setDepth(10);

    this.tweens.add({
      targets: transition,
      alpha: 1,
      duration: 500,
      ease: "Cubic.easeInOut",
      onComplete: () => {
        callback();
        this.tweens.add({
          targets: transition,
          alpha: 0,
          duration: 500,
          ease: "Cubic.easeInOut",
          onComplete: () => {
            transition.destroy();
          },
        });
      },
    });
  }
}
