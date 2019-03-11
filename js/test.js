function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }
    return funcs.reduce((a, b) => {
        return function (...args){
            return a(b(...args))
        }
    })
}



function test(next){
    return function(action){
        console.log(next.toString())
        return next(action)
    }
}

function dispatch(action){
    return action
}

const new_dispatch = compose(test, test, test)(dispatch);
console.log(new_dispatch({type: 'test'}));
