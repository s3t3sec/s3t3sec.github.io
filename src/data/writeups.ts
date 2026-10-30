export interface UpcomingWriteup {
  title: string;
  os: 'Linux' | 'Windows' | 'Outro';
  category: 'Starting Point' | 'Machines';
  tier?: string;
  techniques: string[];
  summary: string;
  number: string;
}

export const upcomingWriteups: UpcomingWriteup[] = [
  {
    title: 'Included',
    os: 'Linux',
    category: 'Starting Point',
    tier: 'Tier 2',
    techniques: ['LFI', 'TFTP', 'LXD'],
    summary: 'Da exposição de arquivos ao abuso de LXD para escalada de privilégios.',
    number: '01',
  },
  {
    title: 'Pennyworth',
    os: 'Linux',
    category: 'Starting Point',
    tier: 'Tier 1',
    techniques: ['Jenkins', 'Credenciais fracas', 'Groovy'],
    summary: 'Acesso ao Jenkins e execução de código por meio do console Groovy.',
    number: '02',
  },
  {
    title: 'Bike',
    os: 'Linux',
    category: 'Starting Point',
    tier: 'Tier 1',
    techniques: ['Node.js', 'Handlebars', 'SSTI'],
    summary: 'Investigação de Server-Side Template Injection em uma aplicação Node.js.',
    number: '03',
  },
];
