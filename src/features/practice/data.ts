export const problemsData = {
    arrays: [
        { name: "Two Sum", difficulty: "easy" },
        { name: "Best Time to Buy and Sell Stock", difficulty: "easy" },
        { name: "Maximum Subarray", difficulty: "medium" },
        { name: "Product of Array Except Self", difficulty: "medium" },
        { name: "Longest Consecutive Sequence", difficulty: "medium" },
        { name: "3Sum", difficulty: "medium" },
        { name: "Container With Most Water", difficulty: "medium" },
        { name: "Merge Intervals", difficulty: "medium" },
        { name: "Find the Duplicate Number", difficulty: "medium" },
        { name: "Longest Substring Without Repeating Characters", difficulty: "medium" },
        { name: "Median of Two Sorted Arrays", difficulty: "hard" },
        { name: "Trapping Rain Water", difficulty: "hard" },
        { name: "First Missing Positive", difficulty: "hard" }
    ],
    linkedlist: [
        { name: "Reverse Linked List", difficulty: "easy" },
        { name: "Linked List Cycle", difficulty: "easy" },
        { name: "Merge Two Sorted Lists", difficulty: "easy" },
        { name: "Remove Nth Node From End", difficulty: "medium" },
        { name: "Add Two Numbers", difficulty: "medium" },
        { name: "Copy List with Random Pointer", difficulty: "medium" },
        { name: "LRU Cache", difficulty: "medium" },
        { name: "Rotate List", difficulty: "medium" },
        { name: "Reorder List", difficulty: "medium" },
        { name: "Merge K Sorted Lists", difficulty: "hard" }
    ],
    trees: [
        { name: "Inorder Traversal", difficulty: "easy" },
        { name: "Maximum Depth of Binary Tree", difficulty: "easy" },
        { name: "Validate Binary Search Tree", difficulty: "medium" },
        { name: "Binary Tree Level Order Traversal", difficulty: "medium" },
        { name: "Convert Sorted Array to BST", difficulty: "easy" },
        { name: "Lowest Common Ancestor", difficulty: "medium" },
        { name: "Serialize and Deserialize Binary Tree", difficulty: "hard" },
        { name: "Word Search II", difficulty: "hard" },
        { name: "Number of Islands", difficulty: "medium" },
        { name: "Course Schedule", difficulty: "medium" }
    ],
    dp: [
        { name: "Climbing Stairs", difficulty: "easy" },
        { name: "House Robber", difficulty: "easy" },
        { name: "Longest Increasing Subsequence", difficulty: "medium" },
        { name: "Coin Change", difficulty: "medium" },
        { name: "Longest Common Subsequence", difficulty: "medium" },
        { name: "Edit Distance", difficulty: "hard" },
        { name: "Unique Paths", difficulty: "medium" },
        { name: "Decode Ways", difficulty: "medium" },
        { name: "Maximum Product Subarray", difficulty: "medium" },
        { name: "Word Break", difficulty: "medium" }
    ],
    sorting: [
        { name: "Merge Sorted Array", difficulty: "easy" },
        { name: "Sort Colors", difficulty: "medium" },
        { name: "Find First and Last Position", difficulty: "medium" },
        { name: "Search in Rotated Array", difficulty: "medium" },
        { name: "Find Peak Element", difficulty: "medium" },
        { name: "Kth Largest Element", difficulty: "medium" }
    ],
    recursion: [
        { name: "Fibonacci Number", difficulty: "easy" },
        { name: "Power of Three", difficulty: "easy" },
        { name: "Letter Combinations of Phone Number", difficulty: "medium" },
        { name: "Permutations", difficulty: "medium" },
        { name: "Subsets", difficulty: "medium" },
        { name: "Generate Parentheses", difficulty: "medium" },
        { name: "N-Queens", difficulty: "hard" },
        { name: "Sudoku Solver", difficulty: "hard" }
    ]
};

export const topicNames: Record<string, string> = {
    arrays: "Arrays & Strings",
    linkedlist: "Linked Lists",
    trees: "Trees & Graphs",
    dp: "Dynamic Programming",
    sorting: "Sorting & Searching",
    recursion: "Recursion & Backtracking"
};

export const topicColors: Record<string, string> = {
    arrays: "bg-blue-500",
    linkedlist: "bg-purple-500",
    trees: "bg-green-500",
    dp: "bg-orange-500",
    sorting: "bg-pink-500",
    recursion: "bg-cyan-500"
};

export const topicIcons: Record<string, string> = {
    arrays: "grid",
    linkedlist: "link",
    trees: "tree-deciduous",
    dp: "layers",
    sorting: "arrow-up-down",
    recursion: "repeat"
};

export type TopicKey = keyof typeof problemsData;
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
    name: string;
    difficulty: Difficulty;
}

export interface ProblemProgress {
    topic: TopicKey;
    problemName: string;
    solved: boolean;
    notes?: string;
}
