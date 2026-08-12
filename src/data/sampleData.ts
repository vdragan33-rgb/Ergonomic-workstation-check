import { AssessmentRecord, ActionItem, StretchExercise } from '../types';

export const SAMPLE_STRETCHES: StretchExercise[] = [
  {
    id: 'stretch-neck',
    titlePt: 'Alongamento Cervical e Lateral do Pescoço',
    titleEn: 'Neck & Cervical Lateral Stretch',
    bodyPartPt: 'Pescoço / Trapezoide',
    durationSec: 30,
    benefitsPt: 'Alivia a tensão acumulada na nuca e ombros causada pela inclinação da cabeça ao olhar para ecrãs.',
    instructionsPt: [
      'Incline suavemente a cabeça em direção ao ombro direito sem levantar o ombro.',
      'Com a mão direita por cima da cabeça, aplique uma pressão muito leve para intensificar a sensação de alongamento.',
      'Mantenha a posição durante 15 segundos respirando fundo e repita para o lado esquerdo.'
    ],
    iconType: 'User'
  },
  {
    id: 'stretch-wrist',
    titlePt: 'Extensão de Punhos e Flexores dos Dedos',
    titleEn: 'Wrist Extension & Finger Flexors',
    bodyPartPt: 'Punhos / Antebraços',
    durationSec: 30,
    benefitsPt: 'Previne a Síndrome do Túnel Cárpico e fadiga dos antebraços resultantes de digitação e uso continuado do rato.',
    instructionsPt: [
      'Estenda o braço direito para a frente ao nível do ombro com a palma da mão voltada para a frente e os dedos a apontar para cima.',
      'Com a mão esquerda, puxe suavemente os dedos para trás em direção ao corpo.',
      'Mantenha durante 15 segundos e depois aponte os dedos para baixo, puxando as costas da mão.'
    ],
    iconType: 'Hand'
  },
  {
    id: 'stretch-rhomboids',
    titlePt: 'Abertura Torácica e Retração de Escápulas',
    titleEn: 'Chest Opener & Scapular Retraction',
    bodyPartPt: 'Ombros e Peitoral Superior',
    durationSec: 30,
    benefitsPt: 'Corrige a postura cifótica (ombros caídos para a frente) e abre a caixa torácica melhorando a respiração.',
    instructionsPt: [
      'Entrelace os dedos das mãos atrás das costas com os braços esticados.',
      'Rode os ombros para trás e para baixo e eleve ligeiramente o peito em direção ao teto.',
      'Respire profundamente pelo nariz durante 20 a 30 segundos.'
    ],
    iconType: 'Shield'
  },
  {
    id: 'stretch-lumbar',
    titlePt: 'Giro de Tronco Sentado e Descompressão Lombar',
    titleEn: 'Seated Spinal Twist & Lumbar Relief',
    bodyPartPt: 'Coluna Lombar / Costas',
    durationSec: 40,
    benefitsPt: 'Mobiliza as vértebras lombares e descomprime os discos intervertebrais após longos períodos sentado.',
    instructionsPt: [
      'Sente-se bem direito na cadeira com os pés bem assentes no chão.',
      'Gire o tronco para o lado direito, apoiando a mão esquerda na parte exterior da coxa direita e a mão direita no encosto.',
      'Gire suavemente e olhe por cima do ombro direito durante 20 segundos. Repita para o lado esquerdo.'
    ],
    iconType: 'RefreshCw'
  },
  {
    id: 'stretch-eyes',
    titlePt: 'Palming e Movimentação Ocular Regra 20-20-20',
    titleEn: 'Eye Palming & 20-20-20 Ocular Drill',
    bodyPartPt: 'Músculos Oculares e Olhos',
    durationSec: 40,
    benefitsPt: 'Reduz a secura ocular e a fadiga muscular dos olhos causada pela emissão contínua de luz do ecrã.',
    instructionsPt: [
      'Esfregue vigorosamente as palmas das mãos uma na outra até sentirem calor.',
      'Pouse as palmas em concha sobre os olhos fechados sem pressionar as pálpebras, bloqueando toda a luz.',
      'Respire fundo durante 20 segundos sentindo o calor e relaxamento muscular.'
    ],
    iconType: 'Eye'
  }
];

export const INITIAL_HISTORICAL_RECORDS: AssessmentRecord[] = [];

export const INITIAL_ACTION_ITEMS: ActionItem[] = [];
