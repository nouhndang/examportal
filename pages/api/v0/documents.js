import { withProtectedRoute } from '@/middlewares/v0/withProtectedRoute';
import { withAllowedMethods } from '@/middlewares/withAllowedMethods';
import cheerio from 'cheerio';

function handler(req, res) {
  return res.json(extractData(res.html));
}

export default withAllowedMethods(withProtectedRoute(handler, '/frmStudentAllDocuments.aspx'), ['GET']);

/**
 * Extracts the data from the markup
 */
function extractData(html) {
  const items = [];
  const $ = cheerio.load(html);
  $('#ContentPlaceHolder1_gvStudentDocuments tr').each((i, el) => {
    const title = $('td:nth-child(2) h3', el).text();
    // Skips the first row because it's the column header
    if (i > 0) {
      items.push({
        id: i,
        title: title === '' ? 'Untitled' : title.trim(),
        date: $('td:nth-child(1) h3', el).text().trim(),
        url: $('td:nth-child(4) a', el).attr('href'),
      });
    }
  });
  return items;
}
