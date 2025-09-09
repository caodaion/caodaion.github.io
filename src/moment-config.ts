import moment from 'moment';

// Set moment locale globally to Vietnamese (vi) or English (en) with Monday as the first day of week
// You can change 'vi' to your preferred locale if needed
moment.updateLocale('vi', {
  week: {
    dow: 1, // Monday is the first day of the week
  }
});
