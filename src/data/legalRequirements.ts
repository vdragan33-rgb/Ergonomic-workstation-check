export interface LegalRefDoc {
  id: string;
  code: string;
  titlePt: string;
  scopePt: string;
  keyArticlesPt: { article: string; summaryPt: string }[];
  officialUrl?: string;
}

export const PORTUGUESE_LEGISLATION_DOCS: LegalRefDoc[] = [
  {
    id: 'dl349-93',
    code: 'Decreto-Lei n.º 349/93',
    titlePt: 'Transposição da Diretiva n.º 90/270/CEE - Equipamentos Dotados de Visor (EDV)',
    scopePt: 'Estabelece as prescrições mínimas de segurança e de saúde respeitantes ao trabalho com equipamentos dotados de visor (monitores e computadores).',
    keyArticlesPt: [
      {
        article: 'Artigo 4.º (Obrigações Gerais)',
        summaryPt: 'O empregador deve analisar os postos de trabalho para avaliar as condições de segurança e saúde relativas à vista, problemas físicos e fadiga mental.'
      },
      {
        article: 'Artigo 6.º (Organização do Trabalho)',
        summaryPt: 'O trabalho deve ser concebido de modo a que a atividade diária diante de ecrãs seja interrompida por pausas periódicas ou mudanças de atividade.'
      },
      {
        article: 'Anexo II (Prescrições Mínimas)',
        summaryPt: 'Define os requisitos técnicos do ecrã, teclado, mesa de trabalho, cadeira, iluminação, ruído, calor e humidade do ar.'
      }
    ]
  },
  {
    id: 'lei102-2009',
    code: 'Lei n.º 102/2009',
    titlePt: 'Regime Jurídico da Promoção da Segurança e Saúde no Trabalho (SST)',
    scopePt: 'Regulamenta o regime jurídico da prevenção de riscos profissionais e serviços de segurança e saúde no trabalho em Portugal.',
    keyArticlesPt: [
      {
        article: 'Artigo 15.º (Obrigações Gerais do Empregador)',
        summaryPt: 'Assegurar aos trabalhadores condições de segurança e de saúde em todos os aspetos relacionados com o trabalho e adaptar o trabalho ao homem.'
      },
      {
        article: 'Artigo 17.º (Avaliação de Riscos)',
        summaryPt: 'Identificar os riscos previsíveis para a segurança e saúde e implementar medidas de prevenção adequadas.'
      }
    ]
  },
  {
    id: 'codigo-trabalho-teletrabalho',
    code: 'Código do Trabalho (Art. 165.º-171.º)',
    titlePt: 'Regime do Teletrabalho e Proteção de Saúde e Segurança',
    scopePt: 'Normas relativas ao teletrabalho e deveres de segurança no trabalho na residência do trabalhador.',
    keyArticlesPt: [
      {
        article: 'Artigo 170.º (Segurança e Saúde no Teletrabalho)',
        summaryPt: 'O trabalhador em regime de teletrabalho tem os mesmos direitos de SST. O empregador deve promover a avaliação dos riscos do posto de trabalho na residência.'
      },
      {
        article: 'Artigo 168.º (Equipamentos de Trabalho)',
        summaryPt: 'O empregador é responsável pela disponibilização dos equipamentos de trabalho e de comunicação necessários para o teletrabalho.'
      }
    ]
  },
  {
    id: 'act-guia-ergonomia',
    code: 'Guia Técnico ACT / NP EN ISO 9241',
    titlePt: 'Orientações da Autoridade para as Condições do Trabalho e ISO 9241-5',
    scopePt: 'Recomendações técnicas para arranjo físico, ângulos articulares neutros, níveis de iluminação e conforto térmico.',
    keyArticlesPt: [
      {
        article: 'Ângulos Articulares Neutros',
        summaryPt: 'Covelos, ancas e joelhos em ângulos de 90.º a 100.º. Punhos em posição neutra sem desvio ulnar/radial.'
      },
      {
        article: 'Nível de Iluminação (Lux)',
        summaryPt: 'Iluminação geral entre 300 e 500 lux para tarefas informáticas de escritório.'
      }
    ]
  }
];
