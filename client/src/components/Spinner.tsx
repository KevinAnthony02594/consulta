// client/src/components/Spinner.tsx

// El import de React se puede omitir en las nuevas versiones
// import React from 'react';

// Añadimos el tipo de retorno : React.JSX.Element
function Spinner(): React.JSX.Element {
  return (
    <div className="w-6 h-6 border-4 border-t-white border-gray-400 rounded-full animate-spin"></div>
  );
}

export default Spinner;