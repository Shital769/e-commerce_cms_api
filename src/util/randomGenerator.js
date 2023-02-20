export const numString = (length) => {
    let num = "";
  
    for (let i = 0; i < length; i++) {
      num += Math.floor(Math.random() * 10);
    }
  
    return num;
  };
  


// export const generateOneTimePassword = (n) =>
// String(Math.ceil(Math.random() * 10 ** n)).padStart(n, "0");
// n being the lengneth of the random number.