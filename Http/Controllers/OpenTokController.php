<?php

namespace App\Http\Controllers\Webhooks;

use App\Events\Chat\Archive\OpenTokChatArchiveEvent;
use App\Events\Chat\ConnectionCreated;
use App\Events\Chat\ConnectionDestroyed;
use App\Events\Chat\StreamingStarted;
use App\Events\Chat\StreamingStopped;
use App\Http\Controllers\Controller;
use App\Models\AppointmentChat;
use Illuminate\Http\Request;

class OpenTokController extends Controller
{
    const EVENT_ARCHIVE = 'archive';
    const EVENT_CONNECTION_CREATED = 'connectionCreated';
    const EVENT_CONNECTION_DESTROYED = 'connectionDestroyed';
    const EVENT_STREAM_CREATED = 'streamCreated';
    const EVENT_STREAM_DESTROYED = 'streamDestroyed';

    public function __construct()
    {
        \Log::useFiles(storage_path().'/logs/openTok.log');
    }

    public function handleOpenTokAction(Request $request)
    {
        \Log::info($request->sessionId . ': '. $request->event, $request->all());
        switch ($request->event) {
            case self::EVENT_ARCHIVE:
                $this->archiveEvent($request);
                break;
            case self::EVENT_CONNECTION_CREATED:
                $this->connectionCreatedEvent($request);
                break;
            case self::EVENT_CONNECTION_DESTROYED:
                $this->connectionDestroyedEvent($request);
                break;
            case self::EVENT_STREAM_CREATED:
                $this->streamCreatedEvent($request);
                break;
            case self::EVENT_STREAM_DESTROYED:
                $this->streamDestroyedEvent($request);
                break;
            default:
                \Log::warning($request->sessionId, $request->all());
        }
    }

    /**
     * @param Request $request
     * Example ( https://tokbox.com/developer/guides/archiving/ ):
     *  {
     *      "id" : "b40ef09b-3811-4726-b508-e41a0f96c68f",
     *      "event": "archive",
     *      "createdAt" : 1384221380000,
     *      "duration" : 328,
     *      "name" : "Foo",
     *      "partnerId" : 123456,
     *      "reason" : "",
     *      "sessionId" : "2_MX40NzIwMzJ-flR1ZSBPY3QgMjkgMTI6MTM6MjMgUERUIDIwMTN-MC45NDQ2MzE2NH4",
     *      "size" : 18023312,
     *      "status" : "available",
     *      "url" : "https://tokbox.com.archive2.s3.amazonaws.com/123456/b40ef09b-3811-4726-b508-e41a0f96c68f/archive.mp4"
     *  }
     * @return bool
     */
    protected function archiveEvent (Request $request)
    {
        $chat = $this->identifyTheChat($request->sessionId);
        if(!$chat) {
            return false;
        }
        $neededData = [
            'ot_archive_id' => $request->id,
            'status' => $request->status,
            'reason' => $request->reason,
            'url' => $request->url
        ];
        event( new OpenTokChatArchiveEvent($chat, $neededData) );
    }

    /**
     * @param Request $request
     * Example ( https://tokbox.com/developer/guides/session-monitoring/#connection-created ):
     *  {
     *      "sessionId": "2_MX4xMzExMjU3MX5-MTQ3MDI1NzY3OTkxOH45QXRr",
     *      "projectId": "123456",
     *      "event": "connectionCreated",
     *      "timestamp": 1470257688309,
     *      "connection": {
     *          "id": "c053fcc8-c681-41d5-8ec2-7a9e1434a21e",
     *          "createdAt": 1470257688143,
     *          "data": "TOKENDATA"
     *      }
     *  }
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    protected function connectionCreatedEvent (Request $request)
    {
        /** @var AppointmentChat $chat */
        $chat = $this->identifyTheChat($request->sessionId);
        if($chat) event(new ConnectionCreated($chat));
    }

    /**
     * @param Request $request
     * Example ( https://tokbox.com/developer/guides/session-monitoring/#connection-destroyed ):
     *  {
     *      "sessionId": "2_MX4xMzExMjU3MX5-MTQ3MDI1NzY3OTkxOH45QXRr",
     *      "projectId": "123456",
     *      "event": "connectionDestroyed",
     *      "reason": "clientDisconnected",
     *      "timestamp": 1470257688309,
     *      "connection": {
     *          "id": "c053fcc8-c681-41d5-8ec2-7a9e1434a21e",
     *          "createdAt": 1470257688143,
     *          "data": ""
     *      }
     *  }
     */
    protected function connectionDestroyedEvent (Request $request)
    {
        $chat = $this->identifyTheChat($request->sessionId);
        if($chat) event(new ConnectionDestroyed($chat));
    }

    /**
     * @param Request $request
     * Example ( https://tokbox.com/developer/guides/session-monitoring/#stream-created ):
     *  {
     *      "sessionId": "2_MX4xMzExMjU3MX5-MTQ3MDI1NzY3OTkxOH45QXRr",
     *      "projectId": "123456",
     *      "event": "streamCreated",
     *      "timestamp": 1470257688309,
     *      "stream": {
     *          "id": "63245362-e00e-4834-8371-9397deb3e452",
     *          "connection": {
     *              "id": "c053fcc8-c681-41d5-8ec2-7a9e1434a21e",
     *              "createdAt": 1470257688143,
     *              "data": ""
     *          },
     *          "id": "63245362-e00e-4834-8371-9397deb3e452",
     *          "createdAt": 1470258845416,
     *          "name": "",
     *          "videoType": "camera"
     *
     *  }
     */
    protected function streamCreatedEvent (Request $request)
    {
        $chat = $this->identifyTheChat($request->sessionId);
        if($chat) event(new StreamingStarted($chat));
    }

    /**
     * @param Request $request
     * Example ( https://tokbox.com/developer/guides/session-monitoring/#stream-destroyed ):
     *  {
     *      "sessionId": "2_MX4xMzExMjU3MX5-MTQ3MDI1NzY3OTkxOH45QXRr",
     *      "projectId": "123456",
     *      "event": "streamDestroyed",
     *      "reason": "clientDisconnected",
     *      "timestamp": 1470257688309,
     *      "stream": {
     *          "id": "63245362-e00e-4834-8371-9397deb3e452",
     *          "connection": {
     *              "id": "c053fcc8-c681-41d5-8ec2-7a9e1434a21e",
     *              "createdAt": 1470257688143,
     *              "data": ""
     *          },
     *          "id": "63245362-e00e-4834-8371-9397deb3e452",
     *          "createdAt": 1470258845416,
     *          "name": "",
     *          "videoType": "camera"
     *
     *  }
     */
    protected function streamDestroyedEvent (Request $request)
    {
        $chat = $this->identifyTheChat($request->sessionId);
        if($chat) event(new StreamingStopped($chat));
    }

    /**
     * @param string $sessionId
     * @return null
     */
    protected function identifyTheChat(string $sessionId)
    {
        try{
            return AppointmentChat::whereOtSessionId($sessionId)->first();
        } catch (\Exception $e){
            return null;
        }
    }
}
