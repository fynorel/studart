//Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function(){

    // DOM = Document Object Model, c'est la représentation des éléments HTML de votre page
    // Cet événement s'assure que tout le code ci-dessous ne s'exécute qu'une fois
    // que la page est entièrement chargée, évitant ainsi des erreurs
    
    // Récupérer le formulaire et la zone de feedback
    let contactForm = document.getElementById('contactForm');
    let formFeedback = document.getElementById('formFeedback');
    
    // Fonction pour échapper les caractères spéciaux (protection XSS)
    function escapeHTML(text){
    
    // Cette fonction est CRUCIALE pour la sécurité
    // Elle remplace les caractères qui pourraient être utilisés pour des attaques XSS
    // par leurs équivalents inoffensifs (entités HTML)
    
        const map = {
        '&' : '&amp;',
        '<' : '&lt;',
        '>' : '&gt;',
        '"' : '&quot;',
        "'" : '&#039;'
        };
        // /[&<>"']/g est une expression régulière:
    // Les crochets [] créent une "classe de caractères" qui match n'importe lequel des caractères à l'intérieur
    // Le "g" à la fin signifie "global" - la recherche se fait sur toute la chaîne, pas juste la première occurrence
    // Cette regex trouve tous les caractères qui sont soit &, <, >, ", ou '
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }
        
});

document.addEventListener('DOMException', function(){
    contactForm.addEventListener('submit', function(event){

        // Réinitialiser le message de feedback
        formFeedback.innerHTML = '';
        formFeedback.className = 'mb-3';

        // Récupérer les valeurs des champs et les nettoyer
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        // Récupération sécurisée des valeurs
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        // trim() enlève les espaces au début et à la fin du texte
        // C'est important pour éviter des valeurs comme " " (juste des espaces)
        if(!validateForm(email, name, subject, message)){
            return false;
        }

        const formData = {
            name: escapeHTML(name),
            email: escapeHTML(email),
            subject: escapeHTML(subject),
            message: escapeHTML(message),
            timestamp: new Date().toISOString() 
        };
        sendToBackend(formData);
    });

    function validateForm(name, email, subject, message) {
        let isValid = true;
        let errors = [];
        
        if (name === ''){
            errors.push('Le nom est recommandé !!!');
        };

        // Validation de l'email avec regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // /^[^\s@]+@[^\s@]+\.[^\s@]+$/ est une expression régulière qui valide un email basique:
        // ^ : début de la chaîne
        // [^\s@]+ : Un ou plusieurs caractères (+) qui ne sont NI un espace (\s) NI un @ ([^\s@])
        // Le ^ à l'intérieur des crochets signifie "tout sauf" ces caractères
        // @ : le caractère @ littéral
        // [^\s@]+ : Même chose qu'avant, un ou plusieurs caractères qui ne sont ni espace ni @
        // \. : un point littéral (échappé avec \ car le point seul a une signification spéciale)
        // [^\s@]+ : Encore la même chose pour le domaine de premier niveau (.com, .fr, etc.)
        // $ : fin de la chaîne
        //
        // Exemples valides: exemple@domaine.com, a@b.c
        // Exemples invalides: exemple@, exemple@domaine, exemple.com
        if(!emailRegex.test(email)){
            errors.push('Veuillez fournir une adresse email valide !!!');
            isValid = false;
        };
            
            // Validation du sujet
        if (subject === '') {
            errors.push('Le sujet est requis');
            isValid = false;
        } else if (subject.length < 3) {
            errors.push('Le sujet doit contenir au moins 3 caractères');
            isValid = false;
        };
            
            // Validation du message
        if (message === '') {
            errors.push('Le message est requis');
            isValid = false;
        } else if (message.length < 10) {
            errors.push('Le message doit contenir au moins 10 caractères');
            isValid = false;
        };
    };

});

