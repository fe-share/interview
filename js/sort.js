function bubble(arr){
    const len = arr.length - 1;
    let temp;
    for (let i = len; i > 0; i--){
        for (let j = 0; j < i; j++){
            temp = arr[j];
            if (temp > arr[j + 1]){
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

function select(arr){
    let len = arr.length, min, temp;
    for (let i = 0;i < len;i++){
        min = arr[i];
        for (let j = i + 1; j < len; j++){
            if (arr[j] < min){
                let temp = min;
                min = arr[j];
                arr[j] = temp;
            }
        }
        arr[i] = min;
    }
    return arr
}

function first(arr){
    arr = arr.filter(item => item > 0);
    // 如果第一个元素不是1，则直接返回1；
    if (arr[0] !== 1){
        return 1;
    } else {
        for (let i = 0, min, len = arr.length; i < len; i++){
            min = arr[i];
            for (let j = i + 1; j < len; j++){
                if (arr[j] < min){
                    let temp = min;
                    min = arr[j];
                    arr[j] = temp;
                }
            }
            arr[i] = min;
            if (i > 0){
                if (min - arr[i - 1] > 1){
                    return arr[i - 1] + 1;
                }
            } else {
                if (min !== 1){
                    return 1;
                }
            }
        }
    }
    return arr.length ? arr.pop() + 1 : 1
}

function maxK(arr, k){
    const len = arr.length - 1;
    for (let i = len, temp; i > len - k; i--){
        for (let j = 0; j < i; j++){
            if (arr[j] > arr[j + 1]){
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr[len - (k - 1)]
}

function maxInterval(arr){
    let max = 0, len = arr.length - 1, space, temp;
    for (let i = len; i > 0; i--){
        for (let j = 0; j < i; j++){
            if (arr[j] > arr[j + 1]){
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
        if (i < len){
            space = arr[i + 1] - arr[i];
            max = max > space ? max : space;
        }
    }
    return Math.max(max, arr[1] - arr[0]);
}

// console.log(maxInterval(
//     [ 100, 3, 2, 1 ]
// ));
// console.log(bubble([5,6,2,7]));
// console.log(select([5,6,2,7]));
console.log(maxK([5,6,2,7], 1));