function clearHTML (element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    };
};

export default clearHTML;