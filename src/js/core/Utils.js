export class Utils{
    /**
     * Read a file
     * @param {String} filePath 
     * @param {Function} callback 
     */
    static readFile(filePath, callback){
        const XHR = new XMLHttpRequest();
        XHR.open('GET', filePath);

        XHR.send();

        XHR.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                callback(this.responseText);
            }
        }
    }
}