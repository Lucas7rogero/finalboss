// finalboss.js
// Este arquivo contém a classe FinalBoss que estende Phaser.Scene.
// A classe possui todos os atributos e métodos adaptados a partir do código original.

class FinalBoss extends Phaser.Scene {
  constructor() {
    super("FinalBoss");
    // Atributos do jogo
    this.questions = [
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

    this.currentQuestionIndex = 0;
    this.score = 0;
    this.lives = 5;
    this.questionImage = null;
    this.characterSprite = null;
    this.answerButtons = [];
    this.feedbackImage = null;
    this.hearts = [];
    this.correctSound = null;
    this.wrongSound = null;
    this.victorySound = null;
    this.nextSound = null;
  }

  preload() {
    this.load.image("gameOverImage", "assets/gameover.png");
    this.load.image("victoryImage", "assets/victory.png");
    this.load.image("restartButtonImage", "assets/recomeçar.png");

    this.questions.forEach((q, index) => {
      this.load.image(`question${index}`, q.question);
      this.load.image(`correct${index}`, q.correctImage);
      this.load.image(`wrong${index}`, q.wrongImage);
    });

    // Carrega os spritesheets dos personagens
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

  create() {
    // Cria as animações para cada personagem
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

    // Adiciona os corações (vidas)
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add
        .image(this.scale.width - 50 - i * 50, 50, "heart")
        .setScale(0.05);
      this.hearts.push(heart);
    }

    // Adiciona os sons
    this.correctSound = this.sound.add("correctSound");
    this.wrongSound = this.sound.add("wrongSound");
    this.victorySound = this.sound.add("victorySound");
    this.nextSound = this.sound.add("nextSound");

    this.showQuestion();
  }

  update() {
    // Atualizações contínuas (se necessário)
  }

  showQuestion() {
    // Remove todos os elementos da cena atual
    this.children.removeAll();

    const currentQuestion = this.questions[this.currentQuestionIndex];

    this.questionImage = this.add
      .image(this.scale.width / 2, this.scale.height * 0.2, `question${this.currentQuestionIndex}`)
      .setScale(0.2);

    if (this.characterSprite) {
      this.characterSprite.destroy();
    }

    this.characterSprite = this.add
      .sprite(
        this.scale.width * 0.15,
        this.scale.height * 0.7,
        currentQuestion.character
      )
      .setScale(0.5)
      .play(`${currentQuestion.character}_anim`);

    this.answerButtons = [];
    const columnX = [this.scale.width * 0.35, this.scale.width * 0.65];
    const rowY = [this.scale.height * 0.5, this.scale.height * 0.6];

    currentQuestion.answers.forEach((answer, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);

      const container = this.add
        .rectangle(columnX[column], rowY[row], 200, 50, 0x333333, 1)
        .setOrigin(0.5)
        .setStrokeStyle(2, 0xffffff);

      const buttonText = this.add
        .text(columnX[column], rowY[row], answer.text, {
          fontSize: "16px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: 180 },
        })
        .setOrigin(0.5);

      container
        .setInteractive()
        .on("pointerdown", () => this.selectAnswer(answer));

      buttonText
        .setInteractive()
        .on("pointerdown", () => this.selectAnswer(answer));

      this.answerButtons.push({ container, buttonText });
    });
  }

  selectAnswer(answer) {
    const currentQuestion = this.questions[this.currentQuestionIndex];

    // Remove os botões de resposta
    this.answerButtons.forEach(({ container, buttonText }) => {
      container.destroy();
      buttonText.destroy();
    });

    if (answer.correct) {
      this.correctSound.play();
      this.score++;
      this.feedbackImage = this.add
        .image(this.scale.width / 2, this.scale.height / 2, `correct${this.currentQuestionIndex}`)
        .setScale(0.15);

      const nextButton = this.add
        .image(this.scale.width * 0.7, this.scale.height * 0.8, "nextButton")
        .setScale(0.2)
        .setInteractive()
        .on("pointerdown", () => {
          this.nextSound.play();
          this.feedbackImage.destroy();
          nextButton.destroy();
          this.nextQuestion();
        });
    } else {
      this.wrongSound.play();
      this.feedbackImage = this.add
        .image(this.scale.width / 2, this.scale.height / 2, `wrong${this.currentQuestionIndex}`)
        .setScale(0.15);

      if (this.lives > 0) {
        const heart = this.hearts.pop();
        heart.destroy();
        this.lives--;
      }

      if (this.lives === 0) {
        this.endGame(true);
        return;
      }

      const closeButton = this.add
        .image(this.scale.width * 0.68, this.scale.height * 0.76, "closeButton")
        .setScale(0.2)
        .setInteractive()
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

    if (isGameOver) {
      this.victorySound.play();
    }

    const endImage = isGameOver
      ? this.add.image(this.scale.width / 2, this.scale.height / 2, "gameOverImage")
      : this.add.image(this.scale.width / 2, this.scale.height / 2, "victoryImage");

    endImage.setScale(0.5);

    const restartButton = this.add
      .image(this.scale.width / 2, this.scale.height * 0.8, "restartButtonImage")
      .setScale(0.2)
      .setInteractive()
      .on("pointerdown", () => {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.lives = 5;
        this.hearts.forEach((heart) => heart.destroy());
        this.hearts = [];
        this.create();
      });
  }
}
