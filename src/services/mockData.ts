import type { News, Comment, AdminUser, UserReporter } from '@/types';

// Before modification
// Mock user data
export const mockUsers: AdminUser[] = [
  {
    id: 1,
    firstname: 'Admin',
    lastname: 'System',
    username: 'admin',
    email: 'admin@example.com',
    image: ['https://picsum.photos/id/1/200/200'],
    roles: ['ROLE_ADMIN'],
    enabled: true,
    created_at: '2025-11-01T08:00:00Z'
  },
  {
    id: 2,
    firstname: 'Reporter',
    lastname: 'Zhang',
    username: 'reporter1',
    email: 'reporter@example.com',
    image: ['https://picsum.photos/id/2/200/200'],
    roles: ['ROLE_MEMBER'],
    enabled: true,
    created_at: '2025-11-02T10:30:00Z'
  },
  {
    id: 3,
    firstname: 'Reader',
    lastname: 'Li',
    username: 'reader1',
    email: 'reader@example.com',
    image: ['https://picsum.photos/id/3/200/200'],
    roles: ['ROLE_READER'],
    enabled: true,
    created_at: '2025-11-03T14:15:00Z'
  }
];

// Convert to UserReporter type
const getReporter = (user: AdminUser): UserReporter => ({
  id: user.id,
  firstname: user.firstname,
  lastname: user.lastname,
  username: user.username,
  email: user.email,
  image: user.image
});

// Mock comment data
const mockComments: Comment[] = [
  {
    id: 1,
    content: 'This is clearly fake news. I checked the relevant information and the actual data is completely different.',
    created_at: '2025-11-01T10:00:00Z',
    usercomment: getReporter(mockUsers[2]),
    voteLabel: 'FAKE',
    image: []
  },
  {
    id: 2,
    content: 'I think this news has some credibility, but it needs more evidence to support it.',
    created_at: '2025-11-01T11:30:00Z',
    usercomment: getReporter(mockUsers[1]),
    voteLabel: 'NOT_FAKE',
    image: []
  },
  {
    id: 3,
    content: 'After my investigation, this incident did happen, but the details are somewhat different.',
    created_at: '2025-11-02T09:15:00Z',
    usercomment: getReporter(mockUsers[2]),
    voteLabel: 'TIE',
    image: []
  }
];

// Mock news data
export const mockNews: News[] = [
  {
    id: 1,
    topic: 'Quantum Computing Breakthrough: Computing Power Increased by 100 Times',
    shortDetail: 'Scientists successfully develop a stable quantum processor with processing speed far exceeding traditional supercomputers',
    detail: 'The Key Laboratory of Quantum Information of the Chinese Academy of Sciences recently announced that they have successfully developed a 100-qubit quantum processor with performance more than 100 times higher than traditional supercomputers for specific computing tasks. The research team stated that this breakthrough opens new avenues for solving complex problems in cryptography, materials science, and drug development. However, experts point out that practical quantum computers still need to overcome technical challenges such as quantum decoherence.',
    
    created_at: '2025-11-10T09:00:00Z',
    reporter: getReporter(mockUsers[1]),
    comments: mockComments.slice(0, 2),
    fakeCount: 18,
    notFakeCount: 42,
    status: 'NOT_FAKE',
    image: ['https://picsum.photos/id/20/800/400', 'https://picsum.photos/id/21/800/400']
  },
  {
    id: 2,
    topic: 'New Research Reveals Direct Link Between Sleep Quality and Memory',
    shortDetail: 'The process of brain waste clearance during deep sleep is crucial for memory consolidation',
    detail: 'Researchers from Harvard Medical School used brain imaging technology to discover that during sleep, especially in deep sleep stages, cerebrospinal fluid circulation in the brain accelerates, enabling more effective clearance of metabolic waste such as beta-amyloid protein. This study directly demonstrates for the first time the importance of high-quality sleep for memory consolidation and neurological health. The research recommends that adults ensure 7-8 hours of high-quality sleep per night to maintain optimal cognitive function.',
    
    created_at: '2025-11-11T11:20:00Z',
    reporter: getReporter(mockUsers[1]),
    comments: [mockComments[2]],
    fakeCount: 5,
    notFakeCount: 55,
    status: 'NOT_FAKE',
    image: ['https://picsum.photos/id/22/800/400']
  },
  {
    id: 3,
    topic: 'First Biodegradable Plastic Alternative Achieves Large-Scale Production',
    shortDetail: 'New bio-based material completely biodegrades in natural environment within 3 months, with properties close to traditional plastics',
    detail: 'An environmental technology company announced that their fully biodegradable plastic alternative has achieved industrial-scale production. This material is made from plant fibers and special enzyme preparations, with strength and toughness similar to traditional plastics, but it can completely biodegrade into harmless substances in natural environments within only 3-6 months. The company plans to increase production capacity fivefold within the next two years to meet global market demand for sustainable packaging materials. Industry experts believe this innovation may fundamentally solve the plastic pollution problem.',
    
    created_at: '2025-11-12T14:00:00Z',
    reporter: getReporter(mockUsers[1]),
    comments: [],
    fakeCount: 15,
    notFakeCount: 35,
    status: 'NOT_FAKE',
    image: ['https://picsum.photos/id/23/800/400']
  },
  {
    id: 4,
    topic: 'Archaeologists Discover Possible Ancient Civilization Ruins, Challenging Historical Understanding',
    shortDetail: 'Giant stone structures found in South American rainforest may be older than known earliest civilizations',
    detail: 'An international archaeological team discovered a series of giant stone buildings and complex water systems deep in the Amazon rainforest. Preliminary carbon dating shows these ruins may be 12,000 years old, thousands of years older than the currently recognized earliest civilizations. These discoveries challenge the traditional timeline of human civilization development, suggesting ancient humans may have mastered advanced architectural techniques and social organization capabilities earlier than we thought. However, some archaeologists are cautious about the dating results and call for more verification tests.',
    
    created_at: '2025-11-13T08:30:00Z',
    reporter: getReporter(mockUsers[1]),
    comments: [],
    fakeCount: 38,
    notFakeCount: 12,
    status: 'FAKE',
    image: ['https://picsum.photos/id/24/800/400']
  },
  {
    id: 5,
    topic: 'World\'s First 3D-Printed Human Organ Transplant Successful',
    shortDetail: 'Liver printed using patient\'s own cells successfully transplanted with no rejection',
    detail: 'Tokyo University School of Medicine announced that they successfully completed the world\'s first liver transplant surgery using 3D bioprinting technology. Doctors used the patient\'s own liver cells and biocompatible scaffolds, cultured in a laboratory for 3 months, to create a fully functional liver. Post-operative observation showed that the transplanted liver functioned normally with no immune rejection. This breakthrough brings new hope for solving the organ donation shortage problem, but experts say the technology still needs more clinical trials to verify its long-term safety and effectiveness.',
    created_at: '2025-11-14T10:15:00Z',
    reporter: getReporter(mockUsers[1]),
    comments: [],
    fakeCount: 22,
    notFakeCount: 38,
    status: 'NOT_FAKE',
    image: ['https://picsum.photos/id/25/800/400']
  },
  {
    id: 6,
    topic: 'Experts Warn: Cell Phone Radiation May Affect Children\'s Brain Development',
    shortDetail: 'Long-term study finds association between low-intensity electromagnetic radiation and cognitive decline',
    detail: 'A large-scale 10-year study published a report stating that children who use cell phones for more than 4 hours daily perform significantly lower than their peers in attention, memory, and executive function tests. Researchers speculate this may be related to electromagnetic radiation from cell phones interfering with brain development. However, the World Health Organization stated that current scientific evidence is insufficient to establish a causal relationship between cell phone radiation and health issues, and recommends preventive measures such as limiting children\'s time using electronic devices.',
    created_at: '2025-11-15T16:45:00Z',
    reporter: getReporter(mockUsers[1]),
    comments: [],
    fakeCount: 35,
    notFakeCount: 15,
    status: 'FAKE',
    image: ['https://picsum.photos/id/26/800/400']
  },
  {
    id: 7,
    topic: 'Renewable Energy Costs Fall Below Fossil Fuels for the First Time',
    shortDetail: 'Global solar and wind power generation costs continue to decline, becoming the most economical energy choice',
    detail: 'The latest report from the International Energy Agency shows that in 2025, the average generation cost of newly added renewable energy projects worldwide is already lower than that of newly built coal and natural gas power plants. Among them, the levelized cost of electricity (LCOE) for large-scale solar power plants has dropped to 2.8 cents per kilowatt-hour, onshore wind power to 3.2 cents, while newly built coal-fired power plants cost approximately 5.5 cents. Experts predict that with technological progress and scale effects, the cost advantage of renewable energy will further expand, potentially accounting for more than 90% of global new electricity installed capacity by 2030.',
    created_at: '2025-11-16T09:30:00Z',
    reporter: getReporter(mockUsers[1]),
    comments: [],
    fakeCount: 8,
    notFakeCount: 42,
    status: 'NOT_FAKE',
    image: ['https://picsum.photos/id/27/800/400']
  },
  {
    id: 8,
    topic: 'Metaverse Technology Breakthrough: Brain-Computer Interface Enables Fully Immersive Experience',
    shortDetail: 'New non-invasive brain-computer interface device can directly read and transmit neural signals',
    detail: 'A tech giant announced the development of a new generation of brain-computer interface technology that can achieve high-precision reading and analysis of brain waves without surgical implantation. The device can capture users\' thoughts and intentions, convert them into actions in virtual environments, while providing tactile and other sensory experiences through neural feedback technology. The company stated that this technology will completely transform the user experience of virtual reality and the metaverse, enabling people to interact directly with the digital world through thought. However, experts are concerned that this technology may bring significant privacy and ethical challenges.',
    created_at: '2025-11-17T13:10:00Z',
    reporter: getReporter(mockUsers[1]),
    comments: [],
    fakeCount: 40,
    notFakeCount: 10,
    status: 'FAKE',
    image: ['https://picsum.photos/id/28/800/400']
  }
];

// Mock user authentication data
export const mockAuthData = {
  authenticate: (username: string, password: string) => {
    const user = mockUsers.find(u => u.email === username);
    if (user) {
      return {
        access_token: 'mock-token-' + user.id,
        user: user
      };
    }
    return null;
  },
  register: (data: any) => {
    const newUser: AdminUser = {
      id: mockUsers.length + 1,
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.email.split('@')[0],
      email: data.email,
      image: data.image || [],
      roles: ['ROLE_READER'],
      enabled: true,
      created_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return {
      access_token: 'mock-token-' + newUser.id,
      user: newUser
    };
  }
};

// Helper functions to get mock data
export const getMockNews = (params?: { 
  limit?: number; 
  page?: number; 
  topic?: string; 
  status?: string 
}): { data: News[], total: number } => {
  let filteredNews = [...mockNews];
  
  // Filter by status
  if (params?.status && params.status !== '') {
    filteredNews = filteredNews.filter(news => news.status === params.status);
  }
  
  // Filter by keyword
  if (params?.topic) {
    const keyword = params.topic.toLowerCase();
    filteredNews = filteredNews.filter(news => 
      news.topic.toLowerCase().includes(keyword) ||
      news.shortDetail.toLowerCase().includes(keyword) ||
      `${news.reporter.firstname} ${news.reporter.lastname}`.toLowerCase().includes(keyword)
    );
  }
  
  // Calculate pagination
  const page = params?.page || 1;
  const limit = params?.limit || 6;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNews = filteredNews.slice(startIndex, endIndex);
  
  return {
    data: paginatedNews,
    total: filteredNews.length
  };
};

// Export all mock data
export default {
  mockNews,
  mockUsers,
  mockComments,
  mockAuthData,
  getMockNews
};