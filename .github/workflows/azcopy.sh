for f in "$@"
do
    if [[ $f == *"dtmi/"* ]]
    then
        az storage blob upload --connection-string "${{ secrets.STORAGE_CONNECTION_STRING }}" --container-name "$web" --name "$f" --file "$f" --no-progress --verbose
        if [ $? -eq 0 ]
        then
            echo "$f copied"
        else
            echo "error uploading model"
            exit 1
        fi
    fi
done
