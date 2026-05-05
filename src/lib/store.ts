import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  imageUrl: string;
  voteCount: number;
  createdAt: string;
}

export interface Voter {
  id: string;
  name: string;
  email: string;
  password: string;
  nationalId: string;
  faceDescriptor: number[] | null;
  hasVoted: boolean;
  votedFor: string | null;
  registeredAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'closed';
}

export interface VoteRecord {
  id: string;
  voterId: string;
  voterName: string;
  voterEmail: string;
  candidateId: string;
  candidateName: string;
  timestamp: string;
}

interface AppState {
  currentUser: Voter | null;
  isAdminLoggedIn: boolean;
  voters: Voter[];
  candidates: Candidate[];
  voteRecords: VoteRecord[];
  election: Election;
  setCurrentUser: (user: Voter | null) => void;
  setAdminLoggedIn: (val: boolean) => void;
  registerVoter: (voter: Omit<Voter, 'id' | 'hasVoted' | 'votedFor' | 'registeredAt' | 'status'>) => { success: boolean; message: string };
  loginVoter: (email: string, password: string) => { success: boolean; message: string };
  castVote: (voterId: string, candidateId: string) => { success: boolean; message: string };
  addCandidate: (candidate: Omit<Candidate, 'id' | 'voteCount' | 'createdAt'>) => void;
  removeCandidate: (id: string) => void;
  updateVoterStatus: (id: string, status: 'approved' | 'rejected') => void;
  updateElection: (election: Partial<Election>) => void;
  storeFaceDescriptor: (voterId: string, descriptor: number[]) => void;
  checkFaceDuplicate: (descriptor: number[]) => { isDuplicate: boolean; matchedVoter?: string };
}

const defaultCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Alexandra Rivera',
    party: 'Progressive Alliance',
    description: 'Former senator with 12 years of public service, focused on education and healthcare reform.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    voteCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c2',
    name: 'Marcus Chen',
    party: 'National Unity Party',
    description: 'Tech entrepreneur turned politician, advocating for digital infrastructure and economic growth.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    voteCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c3',
    name: 'Sarah Thompson',
    party: 'Green Future Coalition',
    description: 'Environmental scientist and activist committed to sustainable development and climate action.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    voteCount: 0,
    createdAt: new Date().toISOString()
  }
];

const defaultElection: Election = {
  id: 'e1',
  title: 'National Presidential Election 2026',
  description: 'Cast your vote for the next President of the nation. Your voice matters.',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  status: 'active'
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAdminLoggedIn: false,
      voters: [],
      candidates: defaultCandidates,
      voteRecords: [],
      election: defaultElection,

      setCurrentUser: (user) => set({ currentUser: user }),
      setAdminLoggedIn: (val) => set({ isAdminLoggedIn: val }),

      registerVoter: (voterData) => {
        const { voters } = get();
        const emailExists = voters.find(v => v.email === voterData.email);
        if (emailExists) return { success: false, message: 'Email already registered.' };
        const idExists = voters.find(v => v.nationalId === voterData.nationalId);
        if (idExists) return { success: false, message: 'National ID already registered.' };

        const newVoter: Voter = {
          ...voterData,
          id: `v_${Date.now()}`,
          hasVoted: false,
          votedFor: null,
          registeredAt: new Date().toISOString(),
          status: 'approved'
        };
        set({ voters: [...voters, newVoter] });
        return { success: true, message: 'Registration successful.' };
      },

      loginVoter: (email, password) => {
        const { voters } = get();
        const voter = voters.find(v => v.email === email && v.password === password);
        if (!voter) return { success: false, message: 'Invalid email or password.' };
        if (voter.status === 'rejected') return { success: false, message: 'Your account has been rejected.' };
        if (voter.status === 'pending') return { success: false, message: 'Your account is pending approval.' };
        set({ currentUser: voter });
        return { success: true, message: 'Login successful.' };
      },

      castVote: (voterId, candidateId) => {
        const { voters, candidates, voteRecords } = get();
        const voter = voters.find(v => v.id === voterId);
        if (!voter) return { success: false, message: 'Voter not found.' };
        if (voter.hasVoted) return { success: false, message: 'You have already voted.' };

        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) return { success: false, message: 'Candidate not found.' };

        const updatedVoters = voters.map(v =>
          v.id === voterId ? { ...v, hasVoted: true, votedFor: candidateId } : v
        );
        const updatedCandidates = candidates.map(c =>
          c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c
        );
        const newRecord: VoteRecord = {
          id: `vr_${Date.now()}`,
          voterId,
          voterName: voter.name,
          voterEmail: voter.email,
          candidateId,
          candidateName: candidate.name,
          timestamp: new Date().toISOString()
        };

        set({
          voters: updatedVoters,
          candidates: updatedCandidates,
          voteRecords: [...voteRecords, newRecord],
          currentUser: { ...voter, hasVoted: true, votedFor: candidateId }
        });
        return { success: true, message: 'Vote cast successfully.' };
      },

      addCandidate: (candidateData) => {
        const { candidates } = get();
        const newCandidate: Candidate = {
          ...candidateData,
          id: `c_${Date.now()}`,
          voteCount: 0,
          createdAt: new Date().toISOString()
        };
        set({ candidates: [...candidates, newCandidate] });
      },

      removeCandidate: (id) => {
        const { candidates } = get();
        set({ candidates: candidates.filter(c => c.id !== id) });
      },

      updateVoterStatus: (id, status) => {
        const { voters } = get();
        set({ voters: voters.map(v => v.id === id ? { ...v, status } : v) });
      },

      updateElection: (electionData) => {
        const { election } = get();
        set({ election: { ...election, ...electionData } });
      },

      storeFaceDescriptor: (voterId, descriptor) => {
  console.log("SAVING FACE:", voterId, descriptor) // 👈 ADD THIS LINE

  const { voters } = get()
  set({
    voters: voters.map(v =>
      v.id === voterId ? { ...v, faceDescriptor: descriptor } : v
    )
  })
},

      checkFaceDuplicate: (descriptor) => {
        const { voters } = get();
        for (const voter of voters) {
          if (!voter.faceDescriptor) continue;
          const distance = Math.sqrt(
            voter.faceDescriptor.reduce((sum, val, i) => sum + Math.pow(val - descriptor[i], 2), 0)
          );
          if (distance < 0.6) {
            return { isDuplicate: true, matchedVoter: voter.name };
          }
        }
        return { isDuplicate: false };
      }
    }),
    {
      name: 'polltech-storage',
      partialize: (state) => ({
        voters: state.voters,
        candidates: state.candidates,
        voteRecords: state.voteRecords,
        election: state.election
      })
    }
  )
);