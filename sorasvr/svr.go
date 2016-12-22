package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("%#v\n", r)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

	body, err := ioutil.ReadAll(r.Body)

	if err == nil && len(body) > 0 {
		req, _ := http.NewRequest(
			"POST",
			"http://harvest.soracom.io",
			bytes.NewBuffer(body),
		)

		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{}
		resp, _ := client.Do(req)
		fmt.Printf("%#v\n", resp)
		defer resp.Body.Close()

		fmt.Fprintf(w, "Post OK !!")
	}
}

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8080", nil)
}
