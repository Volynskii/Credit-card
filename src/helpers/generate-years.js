const generatedYears = (years) => {
    const currentYear = new Date().getFullYear();
    const generatedYears = [];
    for (let i = currentYear; i < currentYear + years; i++) {
        generatedYears.push(i);
    }
    return generatedYears;
}

export default generatedYears;
