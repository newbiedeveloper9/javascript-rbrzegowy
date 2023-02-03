const asyncAdd = async (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return Promise.reject('Argumenty muszą mieć typ number!')
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 100)
    })
}

const addNumbers = async (...args) => {
    let result = 0;
    for (let i = 0; i <= args.length - 1; i++) {
        if (typeof args[i] !== 'number') {
            return Promise.reject('Argumenty muszą mieć typ number!');
        }
        result = await asyncAdd(result, args[i]);
    }
    return result;
};

const measurePerformance = async (func) => {
    var time2 = 0;
    var time1 = performance.now();

    return new Promise((resolve, reject) => {
        func().then((res) => {
            time2 = performance.now();
            resolve(time2 - time1);
        })
    });
};

const addArray = async () => {
    const numbers = Array.from({ length: 10000000 }, () => Math.floor(Math.random() * 100));
    let asyncOperations = 0;
    const sum = numbers.reduce((acc, curr) => {
        asyncOperations++;
        return acc + curr;
    }, 0);
    return `Sum: ${sum}, Async Operations: ${asyncOperations}`;
}


document.addEventListener('DOMContentLoaded', async () => {
    var output = document.getElementById("result");
    output.innerText += `
    addNumbers(1,2,3) = ${await addNumbers(1, 2, 3)}
    addToArray() = ${await measurePerformance(() => addArray())}`;
})