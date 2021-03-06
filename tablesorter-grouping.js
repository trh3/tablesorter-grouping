if(typeof($.tablesorter) === 'undefined') {
  console.error("Please load tablesorter before loading the grouping widget. Things are about to fail.");
}

if(typeof(webonise) === 'undefined') webonise = {};
if(!webonise.tablesorter) webonise.tablesorter = {};

(function() {
  var widget = {};
  widget.id = 'grouping'; // ID to register the widget under
  var classes = widget.cssClasses = {};
  classes.even = "even";                // "even" for zebra striping
  classes.odd = "odd";                  // "odd" for zebra striping
  classes.groupedRow = "grouped-row";   // 2nd and later "grouped" row
  classes.keyColumn = "key-column";     // a column that constitutes the key
  widget.format = function(table) {
    // Just be sure we've got a jQuery object here
    table = $(table);

    // Get a handle on the relevant CSS classes
    var keyColumnClass = this.cssClasses.keyColumn;
    var groupedRowClass = this.cssClasses.groupedRow;
    var evenClass = this.cssClasses.even;
    var oddClass = this.cssClasses.odd;
    var zebraClasses = evenClass + " " + oddClass;
	var sortdata = table.data('tablesorter').sortList
	
	//gets sorted columns
	var sortCol = [];
	$.each(sortdata,function(idx){
		sortCol.push(sortdata[idx][0])
	});

	    // Read the indexes of the key columns from the header	
    var keyCols = [];
    $("th", table).each(function(idx) {
      var th = $(this);
      if(th.hasClass(keyColumnClass) && (($.inArray(idx, sortCol)) > -1)) {

        keyCols.push(idx);
      }
    });
console.log(keyCols);
	    // Ensure the key column class is on only the appropriate columns
    $("tbody tr").each(function() {
      var row = $(this);
      var columns = $("td", row);
      columns.removeClass(keyColumnClass);
      $.each(keyCols, function(idx, value) {
        columns.eq(value).addClass(keyColumnClass);
      });
    });
	
   


    // Clear the grouped rows
    $("tr", table).removeClass(groupedRowClass);

    // Identify the grouped rows
    var previousColumns = null;
	
    $("tr", table).each(function(idx) {
      // Get a handle on the current row
      var currentRow = $(this);
      var currentColumns = $("td", currentRow);

      // Ignore rows without td elements (such as those with only th elements)
      if(!currentColumns.length) return;

      // If this is the first row, just set the previous row and return
      if(!previousColumns) {
        previousColumns = currentColumns;
        return;
      }

      // If this row matches the previous, add the groupedRowClass
      var matches = true;
		$.each(keyCols, function(idx, value) {
        matches = matches && (previousColumns.eq(value).text() === currentColumns.eq(value).text());
      });
      if(matches) currentRow.addClass(groupedRowClass);

      // Set the previous columns to be the current columns and move on
      previousColumns = currentColumns;
      return;
    });
    previousCoumns = null; // Not using the previous columns anymore

    // Now apply zebra striping
    var groupIdx = -1;
    $("tr", table).each(function() {
      var currentRow = $(this);

      // Ignore rows without td elements (such as those with only th elements)
      if(!$("td", currentRow).length) return;

      // Increment the group idx if this isn't a grouped row
      if(!currentRow.hasClass(groupedRowClass)) groupIdx = groupIdx + 1;

      // Update the Zebra striping as appropriate
      var zebraClass = groupIdx % 2 ? oddClass : evenClass;
      if(!currentRow.hasClass(zebraClass)) { // Don't mess with it if it is okay
        currentRow.removeClass(zebraClasses).addClass(zebraClass);
      }
    });
  };

  webonise.tablesorter.grouping = widget;
})();
