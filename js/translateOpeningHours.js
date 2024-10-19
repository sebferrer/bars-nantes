function translateOpeningHours(hours, bar) {
    const daysTranslation = {
        "Mo": "Lundi",
        "Tu": "Mardi",
        "We": "Mercredi",
        "Th": "Jeudi",
        "Fr": "Vendredi",
        "Sa": "Samedi",
        "Su": "Dimanche"
    };

    const monthsTranslation = {
        "Jan": "Janvier",
        "Feb": "Février",
        "Mar": "Mars",
        "Apr": "Avril",
        "May": "Mai",
        "Jun": "Juin",
        "Jul": "Juillet",
        "Aug": "Août",
        "Sep": "Septembre",
        "Oct": "Octobre",
        "Nov": "Novembre",
        "Dec": "Décembre"
    };

    if (!hours || typeof hours !== 'string') {
        //console.error("Horaires manquants ou non valides pour le bar:", bar);
        return "Horaires non disponibles";
    }

    try {
        return hours.split(';').map(part => {
            part = part.trim();

            let months = '';
            if (part.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/)) {
                const [possibleMonths, rest] = part.split(' ', 2);
                months = possibleMonths.split(',').map(month => monthsTranslation[month]).join(' - ');
                part = rest;
            }

            if (!part.includes(' ')) return '';

            const [days, time] = part.split(' ');
            if (!time || !days) return 'Horaires incorrects';

            const daysArray = days.includes(',') ? days.split(',') : days.split('-');
            const frenchDays = daysArray.map(day => daysTranslation[day.trim()]).join(' - ');

            const timePeriods = time.split(',').map(period => {
                let [startTime, endTime] = period.split('-');
                let [startHour, startMinute] = startTime.split(':');
                let [endHour, endMinute] = endTime.split(':');

                if (parseInt(endHour) >= 24) {
                    endHour = String(parseInt(endHour) - 24).padStart(2, '0');
                }

                return `${startHour}h${startMinute} - ${endHour}h${endMinute}`;
            }).join(', ');

            const formattedMonths = months ? ` (${months})` : '';

            return `${frenchDays} ${timePeriods}${formattedMonths}`;
        }).join('\n');
    } catch (error) {
        //console.error("Erreur lors de la traduction des horaires pour le bar:", bar, "Horaires:", hours, "Erreur:", error);
        return "Horaires incorrects";
    }
}
