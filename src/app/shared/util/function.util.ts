export class FunctionUtil {

    /**
      * @author Jorge Luis Caviedes Alvarador
      * @description genera un grupo aletorio
      */
    static GeneralNameGroup(): any {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            const r = (Math.random() * 16) | 0,
            // tslint:disable-next-line:no-bitwise
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    /**
     * @author Jorge Luis Caviedes Alvarador
     * @description genera un id
     */
    public static GeneralId() {
        const fin: string = Math.trunc(Math.random() * 100)
            .toString()
            .substr(0, 4);
        return (
            'xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
                // tslint:disable-next-line:no-bitwise
                const r = (Math.random() * 16) | 0,
                // tslint:disable-next-line:no-bitwise
                    v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }) +
            '-' +
            fin
        );
    }

    /**
     * @description: Funcion que permite manejar literal template (Como en Java)
     *               ejemplo pSeparador: '{' , '<'
     *               ejemplo pCadena: el campo {0} no debe tener {1} - el campo <0> no debe tener <1>
     *               ejemplo pParametros: ['nombre','numeros']
     *               ejemplo retorno: el campo nombre no debe tener numeros 
     * @author: Juan Cabuyales
     * @since: 28/08/2021
     * @param pSeparador: Indica el caracter inicial que encierra los parametros de la cadena
     * @param pCadena: Cadena base para agregar los parametros 
     * @param pParametros: Listado de valores que tendra la cadena final
     * @returns cadena con los valores enviados por parametro
     */
    public static formatearCadena(pSeparador: string,pCadena: string , pParametros?: string[]): string{
        if(pParametros && pParametros.length > 1){
            let indexParametro = 0;
            let arreglo = Array.from(pCadena);
            let cadenaFinal = '';
            arreglo.forEach((item,index) => {
                if(item === pSeparador && (indexParametro <= pParametros.length) ){
                    arreglo[index] = pParametros[indexParametro];
                    arreglo[index + 1] = '';
                    arreglo[index + 2] = '';
                    indexParametro++;
                }
            });        
            arreglo.forEach((item:any)=> {
                if(item){
                    cadenaFinal+= item;
                }
            });
            return cadenaFinal;
        }else{
            return pCadena;
        }        
    }
}
