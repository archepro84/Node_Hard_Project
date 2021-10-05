function getSelf(callback) {
    $.ajax({
        type: "GET",
        url: "/api/users/me",
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {},
        success: function (response) {
            callback(response.user);
        },
        // error: function (xht,status, error) {
        error: function (error) {
            const {status} = error;
            if (status == 401) {
                alert("로그인이 필요 합니다.")
            } else {
                //문제가 발생하였을 경우 현재 localStorage에 있는 데이터를 전부 삭제한다.
                localStorage.clear();
                alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의 하세요.")
            }
            window.location.href = "/";
        },
    });

}

