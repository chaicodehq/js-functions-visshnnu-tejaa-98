/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  // Your code here
  let votes = {};
  let registeredVoters = new Set();
  let votedVoters = new Set();

  candidates.forEach((candidate) => {
    votes[candidate.id] = 0;
  });

  function registerVoter(voter) {
    if (!voter || !voter.id || !voter.name || typeof voter.age !== "number") {
      return false;
    }
    const { id, name, age } = voter;
    if (name === null || name === undefined || name === "") return false;
    if (id === null || id === undefined) return false;
    if (typeof age !== "number" || age < 18) return false;

    if (registeredVoters.has(voter.id)) return false;

    registeredVoters.add(id);
    return true;
  }

  function castVote(voterId, candidateId, onSuccess, onError) {
    if (!registeredVoters.has(voterId)) return onError("Voter not registered");

    const isCandidateExist = candidates.find((c) => c.id === candidateId);
    if (!isCandidateExist) return onError("Candidate does not exist");

    if (votedVoters.has(voterId)) return onError("Voter already voted");
    votes[candidateId]++;
    votedVoters.add(voterId);
    return onSuccess({ voterId, candidateId });
  }

  function getResults(sortFn) {
    const results = candidates.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      party: candidate.party,
      votes: votes[candidate.id] ?? 0,
    }));

    if (typeof sortFn === "function") {
      return results.sort(sortFn);
    }

    return results.sort((a, b) => {
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      return 0;
    });
  }

  function getWinner() {
    const results = getResults();
    if (!results.length || results[0].votes === 0) return null;
    return candidates.find((c) => c.id === results[0].id);
  }

  return {
    registerVoter,
    castVote,
    getResults,
    getWinner,
  };
}

export function createVoteValidator(rules) {
  return function (voter) {
    if (!voter || typeof voter !== "object") {
      return { valid: false, reason: "Invalid voter object" };
    }

    // Check required fields
    for (const field of rules.requiredFields) {
      if (!(field in voter)) {
        return { valid: false, reason: `Missing field: ${field}` };
      }
    }

    // Check minimum age
    if (typeof voter.age !== "number" || voter.age < rules.minAge) {
      return { valid: false, reason: "Underage voter" };
    }

    return { valid: true };
  };
}

export function countVotesInRegions(regionTree) {
  // Base case: invalid input
  if (!regionTree || typeof regionTree !== "object") {
    return 0;
  }

  // Current region votes (safe fallback)
  let total = typeof regionTree.votes === "number" ? regionTree.votes : 0;

  // Recursive case: sum subRegions
  if (Array.isArray(regionTree.subRegions)) {
    for (const subRegion of regionTree.subRegions) {
      total += countVotesInRegions(subRegion);
    }
  }

  return total;
}

export function tallyPure(currentTally = {}, candidateId) {
  return {
    ...currentTally,
    [candidateId]: (currentTally[candidateId] ?? 0) + 1,
  };
}
