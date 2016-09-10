var som = new Audio('audio/queisso.mp3');

var getTempo = function getTempo() {
  $.simpleWeather({
    location: 'Bauru, Brazil',
    woeid: '',
    unit: 'c',
    success: function(weather) {
      setCoisas(weather);
    }
  });
};

var setCoisas = function setCoisas(tempo) {
  var nivel = getNivel(tempo.temp)
  , dia = getDia(tempo);
  
  $('.temperatura').html(tempo.temp + '°C ');
  $('.nome').html(temperaturas[nivel].nome);
  $('.texto').html(temperaturas[nivel].texto);
  
  if (!dia) {
    $('body').addClass('noite');
    $('.estrelas-wrapper').removeClass('hidden');
    $('.bg-img').attr('src','images/bg-noite.png');
    $('.atras-img').attr('src','images/atras-noite.png');
  } else
    $('.nuvem-wrapper').removeClass('hidden');
  
  if (taChovendo(tempo.code))
    colocaChuva();
};

var colocaChuva = function colocaChuva() {
  $('.nuvem-wrapper, .chuva-wrapper').removeClass('hidden');
  $('.nuvem').addClass('chovendo');
  $('.estrelas-wrapper').empty();
};

var horarioAtual = function horarioAtual() {
    data = new Date();
    // utc time em milisegundos
    utc = data.getTime() + (data.getTimezoneOffset() * 60000);
  
    // a data em bauru, utc -3
    bauru = new Date(utc + (3600000 * (-3)));
  
    // transforma o horario em uma string com am/pm  
    horasAux = bauru.toLocaleString('en-US').split(' ');


    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)
      return getTempoSafari(horasAux)
  
    // pega so o horario da string e ignora a data
    horasBauru = horasAux[1].split(':');

  
    // por algum motivo desconhecido o toLocaleString adiciona caracteres nao ascii que sao removidos com o .replace()
    return horasBauru[0].replace(/[^\x00-\x7F]/g, "") + ":" + horasBauru[1].replace(/[^\x00-\x7F]/g, "") + " " + horasAux[horasAux.length-1].replace(/[^\x00-\x7F]/g, "");
;
};

var getTempoSafari = function getTempoSafari(horasAux) {
    var tamanho = horasAux.length
    , horas;

    horas = horasAux[tamanho-2].split(':');
    console.log(horas[0].replace(/[^\x00-\x7F]/g, "") + ":" + horas[1].replace(/[^\x00-\x7F]/g, ""));
    return horas[0].replace(/[^\x00-\x7F]/g, "") + ":" + horas[1].replace(/[^\x00-\x7F]/g, "");
};

var getDia = function getDia(tempo) {
  var data = fixHoraAmericana(horarioAtual())
  , sunrise = fixHoraAmericana(tempo.sunrise)
  , sunset = fixHoraAmericana(tempo.sunset)
  , hRise
  , mRise
  , hSet
  , mSet
  , hAtual
  , mAtual;
  
  // separa as horas e minutos e transforma a variavel em int
  hRise = (sunrise.split(':'))[0]*1;
  mRise = (sunrise.split(':'))[1]*1;
  hSet = (sunset.split(':'))[0]*1;
  mSet = (sunset.split(':'))[1]*1;
  hAtual = (data.split(':'))[0]*1;
  mAtual = (data.split(':'))[1]*1;
  
  // testa se eh dia ou nao
  if ((hAtual > hRise && hAtual < hSet) || (hAtual === hRise && mAtual > mRise) || (hAtual === hSet && mAtual < mSet))
    return true;
  else
    return false;
  
};

var fixHoraAmericana = function fixHoraAmericana(data) {
  if (data.split(' ').length === 1)
    return data;

  var tipo = (data.split(' ')[1]).toLowerCase()
  , tempo = (data.split(' '))[0]
  , horas
  , minutos
  , nova_hora;
  
  horas = (tempo.split(':'))[0];
  minutos = (tempo.split(':'))[1];
  
  switch (tipo) {
    case 'am': horas === '12' ? nova_hora = '00' : nova_hora = horas; break;
    case 'pm': horas === '12' ? nova_hora = horas : nova_hora = horas*1 + 12; break;
  }
  
  return nova_hora + ':' + minutos;
};

var getNivel = function getNivel(temp) {
  if (temp < 15)
    return 0;
  if (temp < 22)
    return 1;
  if (temp < 25)
    return 2;
  if (temp < 30)
    return 3;
  if (temp < 35)
    return 4;
  return 5;
};

var taChovendo = function taChovendo(codigo) {
  if ([3, 4, 11, 12, 37, 38, 39, 40, 45, 47].indexOf(codigo) > -1)
    return true;
  return false;
};

var getFrase = function getFrase() {
  var random = Math.floor(Math.random() * Object.keys(frases).length);
  return frases[random];
};

$(function() {
  setTimeout(getTempo(), 60000);
  
  /* criando estrelas */
  for (i = 0; i < 350; i++)
  $('.estrelas-wrapper').append("<div class='estrelas s" + i +"'></div>");
  
  /* criando chuva */
   for (i = 0; i <= 500; i++)
    $(".chuva-wrapper").append("<div class='chuva chuva-" + i + "'></div>");
  
  $('.nuvem').on('click', function(){
    $(this).toggleClass('pao');
  });

  $('.atras-img').on('click', function(){
    if ($('body').hasClass('noite'))
      $('.frase').removeClass('hidden').html(getFrase());
  });

  $('.onibus-wrapper, .bg-img').on('click', function(){
    som.play();
  });

});

var temperaturas = {
  0 : {
    nome: 'ICE CREAM SANDWICH',
    texto: 'Essa temperatura é considerada glacial em Bauru, logo todos os sanduíches foram evacuados com segurança para uma cidade com clima mais sandwich-friendly e foram substituidos por sorvetes americanos conhecidos como Ice-Cream Sandwich. Os churros continuam em Bauru, mas estão em estado de choque e com muito medo de serem esquecidos. Afinal Bauru é a cidade sanduíche não a cidade churros. Acho melhor esquentar esse clima logo, senão Bauru será invadido por sorvetes da américa do norte.',
  },
  1 : {
    nome: 'SANDUÍCHE GELADO É O NOVO SUCESSO REGIONAL',
    texto: 'Para os padrões de Bauru ainda está bem frio. Algumas pessoas se vestem de esquimós (especialmente para ir a universidade). Mas a boa noticia é que sanduíches não precisam mais ser guardados em geladeiras, e você pode comê-los frios por muito tempo ou usar a energia elétrica para esquentar seu querido e delicioso sanduíche.',
  },
  2 : {
    nome: 'SANDUÍCHE NATURAL AJUDA A PRESERVAR A NATUREZA',
    texto: 'Olha só que delícia! Agora dá pra saborear seu querido sanduíche em temperatura ambiente, não é lá um sanduíche quentinho mas vai que você gosta de sanduíche natural, não é mesmo?',
  },
  3 : {
    nome: 'PRA QUE FORNO QUANDO SE TEM O CALOR DO ABRAÇO DO AR?',
    texto: 'Fornos são legais, fornos são bacanas, mas nem por isso é necessário usar eles duas vezes por semana. O ar tá quente e é fofinho. Porque não usar seu calor para aquecer um saboroso sanduíche?',
  },
  4 : {
    nome: 'MINHA ESQUINA, MEU FORNO',
    texto: 'É oficial, seu sanduíche pode se esquentar sozinho! Para fazer isso é quase tão simples como respirar. Pegue seu dito cujo e coloque numa esquina e sim, sanduíche quentinho sem gastar nada de energia elétrica.',
  },
  5 : {
    nome: 'AR, ÓLEO, BATATAS... E ASSIM NASCERAM AS BATATAS FRITAS SUPER VOADORAS',
    texto: 'Bauru virou um forno, ou uma panela. Logo vamos todos juntar nossas batatas e jogar elas pra cima junto com o óleo e dai PAAA sucesso todos temos belas batatas fritas para acompanhar nosso sanduíche, que por sinal já vem naturalmente quente.',
  },
};

var frases = {
  0: 'Tuts Tuts!',
  1: 'Que Isso?!?',
  2: '15x7 Giulia',
  3: 'Sua vaca!',
  4: 'Vida de Unicórnio!!!',
  5: 'A maré tá virando...',
  6: 'As batatas tão prontas!',
  7: 'Mas gente, e os shots?',
  8: 'Você sabe o que é isso? É claro que não!',
  9: 'Elisa Vibra'
};