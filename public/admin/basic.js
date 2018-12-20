let app = {
    toggle(el, collectionName, attr, id) {
        $.get('/admin/changeStatus', {collectionName: collectionName, attr: attr, id: id}, function (data) {
            if (data.success) {
                if (el.src.indexOf('yes') !== -1) {
                    el.src = '/admin/images/no.gif';
                } else {
                    el.src = '/admin/images/yes.gif';
                }
            }
        })
    }
}