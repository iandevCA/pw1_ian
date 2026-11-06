async function getItems() {
    try {
      const response = await fetch("http://localhost:8000/funcionarios");
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }


async function createItem(item) {
    const response = await fetch("http://127.0.0.1:8000/funcionario/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    const data = await response.json();
    return data;
  }
  
createItem({nome: "Ian", funcao:"a", salario: 12321});

getItems()