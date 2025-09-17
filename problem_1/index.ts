// Iterative (using a for loop)
const sum_to_n_a = (n: number): number => {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    return sum;
};

//Recursion
const sum_to_n_b = (n:number): number => {
    if(n <= 1) return n;
    return n + sum_to_n_b(n - 1);
}

//Initialize an array have length = n
const sum_to_n_c = (n:number): number => {
    const init_arr: number[] = Array.from({ length: n }, (_, i) => i + 1);
    return init_arr.reduce((a, b) => a + b, 0);
};

// Test
console.log([sum_to_n_a, sum_to_n_b, sum_to_n_c].map(fn => fn(5)));
// Expected: [15, 15, 15]
