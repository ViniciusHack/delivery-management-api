### Regras da aplicação

[ X ] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
[ X ] Deve ser possível realizar login com CPF e Senha
[ X ] Deve ser possível alterar a senha de um usuário
[ X ] Deve ser possível realizar o CRUD dos entregadores
[   ] Deve ser possível realizar o CRUD das encomendas
    [ X ] Criar encomenda
    [ X ] Ver encomenda
    [ X ] Deletar encomenda
[ X ] Deve ser possível listar as entregas de um usuário
[   ] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
[   ] Deve ser possível realizar o CRUD dos destinatários
[   ] Deve ser possível retirar uma encomenda
[   ] Deve ser possível marcar uma encomenda como entregue
[   ] Deve ser possível marcar uma encomenda como devolvida
[   ] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
[   ] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de negócio

[ X ] Somente o admin pode alterar a senha de um usuário
[ X ] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
[ X ] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
[   ] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
[   ] Não deve ser possível um entregador listar as encomendas de outro entregador
[   ] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
[   ] Somente o entregador que retirou a encomenda pode marcar ela como entregue